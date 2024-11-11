import express from 'express'
import fs from 'fs'
import path from 'path'

const APP =express()

APP.get('*',(request,response)=>{
    response.sendFile(path.join(__dirname,'www',request.path))
})

APP.listen(80)