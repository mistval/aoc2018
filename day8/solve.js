const fs = require('fs');
const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf8');

function sumLength(nodes) {
  return nodes.reduce((sum, child) => sum + child.getLength(), 0);
}

class Node {
  constructor(children, metadata) {
    this.children = children;
    this.metadata = metadata;
  }

  getLength() {
    return 2 + this.metadata.length + sumLength(this.children);
  }

  sumMetadata() {
    const thisMetadataSum = this.metadata.reduce((sum, m) => sum + parseInt(m), 0);
    const childrenMetadataSum = this.children.reduce((sum, c) => sum + c.sumMetadata(), 0);

    return thisMetadataSum + childrenMetadataSum;
  }

  getValue() {
    if (this.children.length === 0) {
      return this.sumMetadata();
    }

    let sum = 0;
    this.metadata.forEach((metadataValue) => {
      const childIndex = parseInt(metadataValue) - 1;
      const child = this.children[childIndex];
      if (child) {
        sum += child.getValue();
      }
    });

    return sum;
  }
}

function constructTree(tokens) {
  const numChildren = parseInt(tokens[0]);
  const numMetadata = parseInt(tokens[1]);
  const body = tokens.slice(2);

  if (numChildren === 0) {
    const metadata = tokens.slice(2, 2 + numMetadata);
    return new Node([], metadata);
  }

  const children = [];
  let bodyRest = body.slice();
  while (children.length < numChildren) {
    const child = constructTree(bodyRest);
    bodyRest = bodyRest.slice(child.getLength());
    children.push(child);
  }

  return new Node(children, bodyRest.slice(0, numMetadata));
}

const root = constructTree(input.split(' '));

function solveP1() {
  console.log(`Part 1: ${root.sumMetadata()}`);
}

function solveP2() {
  console.log(`Part 2: ${root.getValue()}`);
}

solveP1();
solveP2();
