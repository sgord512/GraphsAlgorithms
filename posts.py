from datetime import datetime
import os
import codecs

class InvalidPostError(Exception):
    def __init__(self, filename):
        self.filename = filename
        
    def __str__(self):
        return "Invalid Post Error: " + filename + " could not be parsed correctly!"
        

class Publish:
    def __init__(self, title, post_name, content, date_gmt):
        self.title = title
        self.post_name = post_name
        self.content = content
        self.date_gmt = datetime.strptime(date_gmt, "%Y-%m-%d %H:%M:%S")            

    def __str__(self):
        s = "Title: " + self.title 
        s += "\n  Date GMT: " + self.date_gmt.strftime('%Y-%m-%d %H:%M:%S')
        s += "\n  Post Name: " + self.post_name
        s += "\n  Content:\n" + self.content
        return s

    def print_post(self):
        print "Title: " + self.title 
        print "  Date GMT: " + self.date_gmt.strftime('%Y-%m-%d %H:%M:%S')
        print "  Post Name: " + self.post_name
        print "  Content:\n" + self.content

    def write_to_file(self, base_dir, filename=None):
        if not filename:    
            year = self.date_gmt.year
            month = self.date_gmt.month
            path = "/".join([base_dir, str(year), str(month)])
            try:
                os.makedirs(path)
                print "Creating path:", path
            except:
                pass
            filename = path + "/" + str(self.date_gmt.day) + "-" +  self.post_name + ".post"
        with codecs.open(filename, 'wt', encoding="utf-8") as f:
            print "Writing to:", filename
            f.write("Title: " + self.title)
            f.write("\nStatus: Publish")
            f.write("\nDateGMT: " + self.date_gmt.strftime('%Y-%m-%d %H:%M:%S'))
            f.write("\nPostName: " + self.post_name)
            f.write("\n---\n")
            f.write(self.content.replace(u'\xa0', u' '))
            f.write("\n---\n")

    @staticmethod
    def read_from_file(filename, base_dir="."):
        with codecs.open("/".join([base_dir, filename]), 'rt', encoding='utf-8') as f:
            print "Reading from:", filename

            line = f.readline()
            if not line.startswith("Title:"):
                raise InvalidPostError(filename)
            title = line[len("Title:"):].strip()

            line = f.readline()
            if not line.startswith("Status:"):
                raise InvalidPostError(filename)
            status = line[len("Status:"):].strip()

            line = f.readline()
            if not line.startswith("DateGMT:"):
                raise InvalidPostError(filename)
            date_gmt = line[len("DateGMT:"):].strip()

            line = f.readline()
            if not line.startswith("PostName:"):
                raise InvalidPostError(filename)
            post_name = line[len("PostName:"):].strip()

            line = f.readline()
            if not line.startswith("---"):
                raise InvalidPostError
            line = f.readline()
            content = ""
            while line and not line.startswith("---"):
                content += line
                line = f.readline()

            print "Finished reading."
            return Publish(title, post_name, content, date_gmt)

        

class Draft:
    def __init__(self, title, post_name, content):
        self.title = title
        self.post_name = post_name
        self.content = content

    def __str__(self):
        s = "Title: " + self.title 
        s += "\n  Unpublished Draft"
        s += "\n  Post Name: " + self.post_name
        s += "\n  Content:\n" + self.content
        return s

    def print_post(self):
        print "Title: " + self.title 
        print "  Unpublished Draft"
        print "  Post Name: " + self.post_name
        print "  Content:\n" + self.content

    def write_to_file(self, base_dir, filename=None):
        if not filename:
            path = "/".join([base_dir, "drafts"])
            try:
                os.makedirs(path)
                print "Creating path:", path
            except:
                pass
            filename = path + "/" + str(self.post_name) + ".draft"
        with codecs.open(filename, 'wt', encoding="utf-8") as f:
            print "Writing to:", filename
            f.write("Title: " + self.title)
            f.write("\nStatus: Draft")
            f.write("\nPostName: " + self.post_name)
            f.write("\n---\n")
            f.write(self.content)
            f.write("\n---\n")
