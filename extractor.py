import sys
from posts import Publish, Draft
from BeautifulSoup import BeautifulStoneSoup as bss

BLOG_DIR = "blog"
XML_FILE = 'starlingsoftheslipstream.wordpress.2013-05-19.xml'

def cleanup_items(items):
    for item in items: 
        for postmeta in item.findAll('wp:postmeta'):
            postmeta.extract()
        for commentmeta in item.findAll('wp:commentmeta'):
            commentmeta.extract()
        item.find('wp:is_sticky').extract()
        item.find('wp:ping_status').extract()
        item.find('wp:comment_status').extract()
        # item.find('wp:post_date').extract()

def make_post(item):
    title = item.title.text
    desc = item.description
    post_name = desc.find('wp:post_name').text
    content = unicode(desc.find('content:encoded').text)
    status = desc.find('wp:status').text
    if status == 'draft':
        post = Draft(title, post_name, content)
    elif status == 'publish':
        date_gmt = desc.find('wp:post_date_gmt').text
        post = Publish(title, post_name, content, date_gmt)
    return post


if __name__ == "__main__":    
    data = bss(file(XML_FILE).read(), 
               convertEntities=bss.ALL_ENTITIES)

    items = data.contents[6].findAll('item')
    cleanup_items(items)
    posts = map(make_post, items)
    
    map(lambda post: post.write_to_file(BLOG_DIR), posts)
