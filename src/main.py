import json
import eel
import os
import time
from github import Github
from github import InputGitAuthor

json_data = []
sha = ''
auth_token = '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'
file_path = 'AnimeList.json'

@eel.expose
def get_json_data():
    global json_data
    global sha
    g = Github(auth_token)
    repo = g.get_repo('TeaSipp/GroupActivityTracker')
    contents = repo.get_contents(file_path)
    sha = contents.sha
    json_data = json.loads(contents.decoded_content.decode('utf-8'))

    print(str(len(json_data))+' objects found')
    for x in json_data:
        print(x)
        eel.appendItem(x["Title"], x["Image"], x["Priority"], x["Type"], x["Id"])
        time.sleep(0.1)

@eel.expose
def update_json(title, image, priority, type, id):
    for x in json_data:
        if x["Id"] == id:
            print(x)
            x["Title"] = title+"UPDATED"
            x["Image"] = image
            x["Priority"] = priority
            x["Type"] = type
            print(x)
    push_repo(json_data)
    return True

@eel.expose
def fetch_edit(id):
    global json_data
    for i in json_data:
        if i['Id'] == int(id):
            print('ID Found')
            eel.editCard(i)
            return True

@eel.expose
def push_repo(json_obj, create):
    if not create:
        for i in json_data:
            if i['Id'] == json_obj['Id']:
                i['Title'] = json_obj['Title']
                i['Image'] = json_obj['Image']
                i['Priority'] = json_obj['Priority']
    else:
        json_data.append(
            {
                "Title":json_obj['Title'],
                "Image":json_obj['Image'],
                "Priority":json_obj['Priority'],
                "Type":json_obj['Type'],
                "Id":len(json_data)
            }
        )

    

    data = '['
    for i in json_data:
        data += '\n'+str(i)+','
    data = data[:-1]
    data += '\n]'
    data = data.replace("'", '"')
    print(data)


    g = Github(auth_token)
    repo = g.get_repo('TeaSipp/GroupActivityTracker')
    branch = 'main'
    author = InputGitAuthor(
        'TeaSipp',
        'j.evon0096@gmail.com'
    )
    contents = repo.get_contents(file_path)
    repo.update_file(contents.path, 'Updated from App', data, contents.sha, branch=branch, author=author)
    find_update()
    return True

@eel.expose
def get_sha():
    eel.getSha(sha)

@eel.expose
def find_update():
    global json_data
    g = Github(auth_token)
    repo = g.get_repo('TeaSipp/GroupActivityTracker')
    contents = repo.get_contents(file_path)
    new_data = json.loads(contents.decoded_content.decode('utf-8'))
    json_data = new_data
    for i in new_data:
        eel.updateElement(i)

@eel.expose
def deleteItem(id):
    print(id)
    for i in json_data:
        if i['Id'] == id:
            print('removing:', i)
            json_data.remove(i)
    for i in json_data:
        if i['Id'] > id:
            i['Id'] -= 1

    data = '['
    for i in json_data:
        data += '\n'+str(i)+','
    data = data[:-1]
    data += '\n]'
    data = data.replace("'", '"')
    print(data)

    g = Github(auth_token)
    repo = g.get_repo('TeaSipp/GroupActivityTracker')
    branch = 'main'
    author = InputGitAuthor(
        'TeaSipp',
        'j.evon0096@gmail.com'
    )
    contents = repo.get_contents(file_path)
    repo.update_file(contents.path, 'Updated from App', data, contents.sha, branch=branch, author=author)
    eel.removeElement(id)
    return True

@eel.expose
def getnewsha():
    g = Github(auth_token)
    repo = g.get_repo('TeaSipp/GroupActivityTracker')
    contents = repo.get_contents(file_path)
    sha = contents.sha
    return sha

directory = os.path.dirname(__file__)
eel.init(os.path.join(directory, 'www/'))
eel.start('index.html')