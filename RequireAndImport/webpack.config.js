module.exports = {
    mode:"development",
    entry:{
        index: './index.js'
    },
    output:{
        filename:'[name].bundle.js',
        chunkFilename:'[name].bundle.js'
    }
   
}