const path = require('path')
const fs = require('fs')

class FileTree {
    constructor({ path, needFlattenFiles }) {
        this.path = path
        this.tree = []
        if (needFlattenFiles) {
            this.flattenFiles = []
        }
    }

    getAllFiles() {
        const todo = []
        const tree = []
        todo.push(this.path)
        while (todo.length) {
            console.log('todo', todo)
            const topDirStr = todo.shift()
            const fullpath = path.join(__dirname, topDirStr)
            const info = fs.readdirSync(fullpath, {
                withFileTypes: true,
            })
            for (let i = 0; i < info.length; i++) {
                const cur = info[i]
                const isdir = cur.isDirectory()
                if (isdir) {
                    todo.push(path.join(topDirStr, cur.name))
                } else {
                    tree.push(this.getFileInfo(cur))
                }
            }
            console.log('info', info)
        }
    }

    getFileTree() {
        return this._getFileTree(this.path, this.tree)
    }

    _getFileTree(dirpath, container) {
        const fullpath = path.resolve(__dirname, dirpath)
        const info = fs.readdirSync(fullpath, {
            withFileTypes: true,
        })
        for (let i = 0; i < info.length; i++) {
            const cur = info[i]
            const isdir = cur.isDirectory()
            const curFullPath = path.resolve(dirpath, cur.name)
            const fileDirInfo = this.getFileInfo(cur, curFullPath)
            container.push(fileDirInfo)
            if (isdir) {
                this._getFileTree(curFullPath, container[i].children)
            }
        }
        return this.tree
    }

    getFileInfo(fileDirent, currentPath) {
        console.log('currentPath', currentPath)
        const res = {}
        const type = fileDirent.isDirectory() ? 'dir' : 'file'
        console.log('type', type)
        const name = fileDirent.name
        res.name = name
        res.type = type
        res.dirname = __dirname
        res.path = currentPath
        if (type === 'dir') {
            res.children = []
        } else {
            const filetype = name.substring(name.lastIndexOf('.') + 1, name.length)
            res.filetype = filetype
        }
        return res
    }
}

const tree = new FileTree({
    path: './test',
})

// tree.getAllFiles(`/test`)
const tree1 = tree.getFileTree()
console.log("tree", tree1)
