from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
sources = {
    "hillside": "assets/images/hero-candidates/hero-hillside.jpg",
    "forest": "assets/images/hero-candidates/hero-forest.jpg",
    "roof": "assets/images/roof-assessment-aerial.jpg",
    "solar-home": "assets/images/service-solar-home.jpg",
    "residential": "assets/images/nz-home-cook-strait.jpg",
}
destination = root / "assets/images/web"
destination.mkdir(exist_ok=True)
for name, source in sources.items():
    with Image.open(root / source) as original:
        original = ImageOps.exif_transpose(original).convert("RGB")
        for width in (800, 1600):
            image = original.copy()
            image.thumbnail((width, round(width * original.height / original.width)))
            image.save(destination / f"{name}-{width}.webp", quality=84, method=6)
            print(f"{name}-{width}.webp: {image.width} x {image.height}")
