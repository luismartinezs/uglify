const vueCompiler = require('vue-template-compiler')
const fs = require('fs');
const UglifyJS = require("uglify-js");

if(process.argv.length < 3) {
    console.log('Please provide a path to the vue file');
    process.exit(1);
}

const filePath = process.argv[2];

fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
        return console.log(err);
    }

    let parsedVueFile = vueCompiler.parseComponent(data);

    // Minify JavaScript
    let result = UglifyJS.minify(parsedVueFile.script.content);

    // Check for errors
    if (result.error) {
        console.error(`Error in file ${filePath}: `, result.error);
        return;
    }

    // Replace original script content with minified version
    parsedVueFile.script.content = result.code;

    // Construct the minified vue component
    let minifiedVue = `<template>${parsedVueFile.template.content}</template>\n<script>${parsedVueFile.script.content}</script>\n<style>${parsedVueFile.styles[0].content}</style>`;

    console.log(minifiedVue);
});
