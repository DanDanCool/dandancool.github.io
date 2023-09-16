import markdown
import argparse
import os.path
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

def buildhistory():
    files = []
    for p in Path('blog').glob('*.md'):
        files.append((p, os.path.getmtime(p)))
    files.sort(key=lambda pair: pair[1])

    historyjsx = """
    import { Link } from 'react-router-dom'
    export default function get_history () {
    const posts = ["""

    for pair in reversed(files):
        route = pair[0].stem
        historyjsx += f"\"{route}\","

    historyjsx += """];
    return posts;
    }
    """
    p = Path("src/components/BlogPosts/history.jsx")
    p.write_text(historyjsx)

buildhistory()
parser = argparse.ArgumentParser()
parser.add_argument('-f', action='store_true')
args = parser.parse_args()
buildfiles(args.f)
