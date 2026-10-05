"""Create website derivatives directly from 1003LINK.zip; never overwrite masters.

Usage: python scripts/prepare-shichahai-images.py /path/to/1003LINK.zip
Requires Pillow. Lossless WebP preserves decoded JPEG pixels at native size;
smaller variants use Lanczos resampling and lossless encoding, without upscaling.
"""
from pathlib import Path
from io import BytesIO
import hashlib
import json
import sys
import zipfile
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SPECS = {
    'shichahai-plan': {
        'source': '总平面图.jpg', 'crop': None,
        'widths': [480, 960, 1440, 1976], 'layout': [820, 973],
        'match': 'Overall site plan: same proposal and extent.',
    },
    'shichahai-section': {
        'source': '图10 南区首层平面图&剖面图.jpg',
        'crop': [68, 2054, 4025, 2828],
        'widths': [800, 1600, 2400, 3957], 'layout': [822, 242],
        'match': 'Corresponding south section; isolate the complete section from the original raster export. Export labels/framing differ from the board version.',
    },
}

def sha(data):
    return hashlib.sha256(data).hexdigest()

def main(archive):
    assets = ROOT / 'assets'
    inventory = []
    output = {}
    with zipfile.ZipFile(archive) as z:
        originals = {Path(n).name: n for n in z.namelist() if not n.endswith('/')}
        for name, entry in originals.items():
            data = z.read(entry)
            with Image.open(BytesIO(data)) as im:
                inventory.append({'file': name, 'width': im.width, 'height': im.height,
                                  'format': im.format, 'bytes': len(data), 'sha256': sha(data)})
        for key, spec in SPECS.items():
            data = z.read(originals[spec['source']])
            with Image.open(BytesIO(data)) as raw:
                im = ImageOps.exif_transpose(raw).convert('RGB')
                icc = raw.info.get('icc_profile')
            if spec['crop']:
                im = im.crop(tuple(spec['crop']))
            variants = []
            for width in spec['widths']:
                assert width <= im.width, 'Never upscale a derivative'
                size = (width, round(im.height * width / im.width))
                variant = im if size == im.size else im.resize(size, Image.Resampling.LANCZOS)
                path = assets / f'{key}-original-{width}.webp'
                options = {'lossless': True, 'method': 6, 'exact': True}
                if icc:
                    options['icc_profile'] = icc
                variant.save(path, 'WEBP', **options)
                with Image.open(path) as check:
                    assert check.convert('RGB').tobytes() == variant.tobytes(), 'Lossless verification failed'
                variants.append({'path': 'assets/' + path.name, 'width': width, 'height': size[1],
                                 'format': 'lossless WebP', 'bytes': path.stat().st_size,
                                 'sha256': sha(path.read_bytes())})
            output[key] = {**spec, 'variants': variants, 'zoom': variants[-1]['path'],
                           'default': variants[1]['path'], 'thumbnail': variants[0]['path']}
    manifest = {'archive': Path(archive).name, 'archive_sha256': sha(Path(archive).read_bytes()),
                'master_policy': 'Original archive retained byte-for-byte. Masters are never recompressed or overwritten. Only derivatives belong in website assets.',
                'originals': inventory, 'assets': output,
                'unmatched_existing': {
                    'shichahai-history': 'Historical timeline not supplied.',
                    'shichahai-analysis': 'Existing six-panel analysis differs from the supplied eight-panel annotated analysis.',
                    'shichahai-before-after': 'Existing ten-view before/after montage not supplied.',
                    'shichahai-seam': 'Existing two-panel diagram differs from the supplied landscape analysis.',
                    'shichahai-courtyard': 'Existing four-panel courtyard strategy strip not supplied; the landscape sheet is a different diagram.',
                }}
    (ROOT / 'image-sources' / 'shichahai-20261005.json').write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(output, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main(Path(sys.argv[1]))
