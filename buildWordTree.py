import json

def run():
	tree = {}

	with open("words.txt", 'r') as f:
		for line in f:
			line = line.strip()
			if len(line) == 0:
				continue
			subtree = tree
			line += "$"
			for c in line:
				if not c in subtree:
					subsubtree = {}
					subtree[c] = subsubtree
				subtree = subtree[c]

	return tree

if __name__ == "__main__":
	tree = run()
	output = "var WordTrie = " + json.dumps(tree) + ";"
	with open("WordTrie.js", 'w+') as f:
		f.write(output)
