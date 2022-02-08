import { promises } from 'fs'
import documentation from 'documentation'
import markedpp from 'markedpp'

const documentationOptions = {
  extension: 'js',
  shallow: true,
  'markdown-toc': false,
  'sort-order': 'alpha'
}

const apiGen = async function (filename) {
  const docs = await documentation.build([filename], documentationOptions).then(documentation.formats.md)
  return docs.split('\n')
    .map(indentHeadingsOneMoreLevel)
    .map(line => {
    // documentation.js is creating a link to MDN DOM Node, so need to fix
      return line
        .replace(/[#]+ Parameters/, 'Parameters:') // deal with excessively deep nestings
        .replace(/[#]+ Examples/, '') // deal with excessively deep nestings
        // Provide links to common types
        .replace('**[Node][1]**', '[Node](#node)')
        .replace('Generator', '[Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)')
        .replace('IterableIterator<', '[IterableIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)<')
        .replace('IterableIterator\\<', '[IterableIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator)\\<')
        .replace('Iterable<', '[Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)<')
        .replace('Iterable\\<', '[Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol)\\<')
    })
    .join('\n')
}

const addToc = async function (withoutToc) {
  return new Promise((resolve, reject) => {
    markedpp(withoutToc, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const indentHeadingsOneMoreLevel = line => {
  if (line.startsWith('#')) {
    return '#' + line
  }
  return line
}

const generateReadme = async function (readmeFile) {
  const readme = await promises.readFile(readmeFile, 'utf-8')
  const doc = await addToc(readme)
  const fixed = doc
    .split('\n')
    .map(line => {
    // markedpp appears to have a bug on TOC when title is 'constructor'
      return line
        .replace('  * [constructor](#constructor-function Object() { [native code] })', '  * [constructor](#constructor)')
    })
    .join('\n')
  await promises.writeFile(readmeFile, fixed, 'utf-8')
}

const main = async function () {
  const apiDoc = await apiGen('src/isnumber.js')
  await promises.writeFile('api.md', apiDoc, 'utf-8')
  await generateReadme('README.md')
  await promises.unlink('api.md') // cleanup
}

main()
