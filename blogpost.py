import markdown
import argparse
from pathlib import Path

def md2jsx(name):
    with open(name, 'r') as f:
        text = f.read()
        html = markdown.markdown(text, output_format="html")
    wrap = "return (<div>\n {} \n</div>);".format(html)
    jsx = "export default function get_data() {\n" + wrap + "\n}"
    return jsx

def buildfiles(force=False):
    files = [ p.stem for p in Path('blog').glob('*.md') ]
    for fname in files:
        p = Path('src/Components/BlogPosts/Posts') / f"{fname}_wrapper.jsx"
        if p.exists() and not force: continue

        html = md2jsx(f"blog/{fname}.md")
        p.write_text(html)


parser = argparse.ArgumentParser()
parser.add_argument('-f', action='store_true')
args = parser.parse_args()
buildfiles(args.f)
