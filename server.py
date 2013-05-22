# Setting up port for server, and configuring requirejs
import logging, codecs, os, re, sys, json
from flask import Flask, render_template, redirect, url_for, abort
from posts import Publish 

app = Flask(__name__)

logger = logging.getLogger(__name__)

BLOG_DIR = 'blog'

# The sitemap is contained in 'config.json' which gets parsed into the pages variable
pages = json.load(codecs.open('config.json', encoding='utf8'))
page_links = []
for key, page in pages.items(): 
    page_link = page
    page["destination"] = key
    page_links.append(page_link)

@app.route("/")
def index():
    print "index"
    return render_template("index.template", pages=page_links)

@app.route("/<page>")
def send_page(page):
    logger.info("Sending %s along the wire!!", page);
    if not pages[page]: 
        abort(404)
    return render_template("page.template", page=pages[page])

@app.errorhandler(404)
def page_not_found(error):
    return render_template("not-found.html"), 404

day_matcher = re.compile("[0-9]+")

post_dirs = filter(lambda subdir: subdir != "drafts", os.listdir(BLOG_DIR))
post_list = []
post_map = {}
for year in post_dirs:
    post_map[year] = {}
    post_months = os.listdir("/".join([BLOG_DIR, year]))
    for month in post_months:
        post_map[year][month] = []
        posts = os.listdir("/".join([BLOG_DIR, year, month]));
        for post_file in posts:
            day_match = day_matcher.match(post_file)
            if not day_match:
                print "Invalid post filename!"
                sys.exit(1)
            day = day_match.group(0)
            link = "/".join([BLOG_DIR, year, month, post_file])
            post_obj = Publish.read_from_file(link)
            post_dict = { "link": link, 
                          "year": int(year), 
                          "month": int(month), 
                          "day": int(day),
                          "name": post_file,
                          "title": post_obj.title, 
                          "content": post_obj.content }            
            post_list.append(post_dict)
            post_map[year][month].append(post_dict)

post_list.sort(key=lambda post: post["link"])

# These routes are used for everything but the index
@app.route("/js/<path:module>")
def send_js(module): 
    js_module = "/".join(['js', module])
    return redirect(url_for('static', filename=js_module))

@app.route("/blog")
def blog_index():
    return render_template("blog_index.template", posts=post_list)

@app.route("/blog/<int:year>/<int:month>/<post_name>")
def blog_post(year, month, post_name):
    logger.info("Sending " + str(year) + "-" + str(month) + "-" + post_name)
    post_month = post_map[str(year)][str(month)]
    for post_dict in post_month:
        if post_dict["name"] == post_name:
            return render_template("blog_post.template", post=post_dict)
    abort(404)



@app.route("/favicon.ico")
def favicon():
    return redirect(url_for('static', filename='favicon.ico'))

if __name__ == "__main__":
    app.run(debug=True)
