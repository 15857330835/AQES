const fs = require('fs')
const path = require('path')
const args = require('minimist')(process.argv.slice(2))
var dist_dir = path.resolve(__dirname, '../../dist')
console.log(dist_dir)
const webPath = args['path'] || `//cdn.aodianyun.com/conlcps/v2`
// var getCSSAndJsArr = function(cssArrCallBack,jsArrCallBack){
//     fs.readdir(dist_dir,function(err, files){
//         if (err) {
//             return console.error(err);
//         }
//         files.forEach( function (file){
//             let file_path = `${dist_dir}/${file}/`
//             fs.stat(file_path,function(err,stats){
//                 if (err) {
//                     return console.error(err);
//                 }
//                 if(stats.isDirectory() && file === 'css'){
//                     fs.readdir(file_path,function(err, css_files){
//                         if (err) {
//                             return console.error(err);
//                         }
//                         css_files.forEach( function (file){
//                             css_urls.push(file)
//                         })
//                         // console.log(css_urls)
//                         cssArrCallBack && cssArrCallBack(css_urls)
//                     })
//                 }else if(stats.isDirectory() && file === 'js'){
//                     fs.readdir(file_path,function(err, js_files){
//                         if (err) {
//                             return console.error(err);
//                         }
//                         js_files.forEach( function (file){
//                             js_urls.push(file)
//                         })
//                         // console.log(js_urls)
//                         jsArrCallBack && jsArrCallBack(js_urls)
//                     })
//                 }

//             })

//         });
//      });
// }
// getCSSAndJsArr(function(cssArr){
//     console.log(cssArr)
// },function(jsArr){
//     console.log(jsArr)
// })
var getCssAndJsArr = async function(dist_dir, callback) {
  const css_urls = []
  const js_urls = []
  try {
    const files = await fs.readdirSync(dist_dir)
    console.log(files)
    const promise = new Promise(function(resolve, reject) {
      files.forEach(async function(file) {
        let file_path = `${dist_dir}/${file}/`
        try {
          const stats = await fs.statSync(file_path)
          if (stats.isDirectory() && file === 'css') {
            try {
              const css_files = await fs.readdirSync(file_path)
              css_files.forEach(function(file) {
                css_urls.push(`${webPath}/css/${file}`)
              })
              resolve()
            } catch (err) {
              console.error(err)
              reject(err)
            }
          } else if (stats.isDirectory() && file === 'js') {
            try {
              const js_files = await fs.readdirSync(file_path)
              js_files.forEach(function(file) {
                js_urls.push(`${webPath}/js/${file}`)
              })
              resolve()
            } catch (err) {
              console.error(err)
              reject(err)
            }
          }
        } catch (err) {
          console.error(err)
          reject(err)
        }
      })
      //   setTimeout(resolve,500)
    })
    promise.then(
      function() {
        callback(null, {
          css_urls: css_urls,
          js_urls: js_urls
        })
      },
      function(err) {
        callback(err, null)
      }
    )
  } catch (err) {
    console.error(err)
    callback(err, null)
  }
}
getCssAndJsArr(dist_dir, async function(err, res) {
  if (err !== null) {
    console.error(err)
    return
  }
  try {
    let jsStr = `const { css_urls, js_urls } = ${JSON.stringify(res,null, '\t')}\nexport { css_urls, js_urls }`
    await fs.writeFileSync(
      path.resolve(__dirname, './') + '/cssAndJsArr.js',
      jsStr
    )
  } catch (err) {
    console.error(err)
  }

  //   console.log(err, res)
})
