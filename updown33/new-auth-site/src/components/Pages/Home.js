import React, { Component } from 'react'

import {Storage} from 'aws-amplify'

class Home extends Component{
  state={fileUrl:'', file:'', filename:''}
  handleChange=e=>{
    const file=e.target.files[0]
    this.setState({
      fileUrl: URL.createObjectURL(file),
      file,
      filename: file.name
    })
  }
  saveFile=()=>{
    Storage.put(this.state.filename, this.state.file)
    .then(()=>{
      console.log('succesfully saved file !')
      this.setState({fileUrl: '', file: '', filename: ''})
    })
    .catch(err=>{
      console.log('error uploading the file!',err)
    })
  }

  listFile=()=>{
    Storage.list(this.state.filename, this.state.file)
    .then(()=>{
      console.log('succesfully list file !')
      this.setState({fileUrl: '', file: '', filename: ''})
    })
  }

  donwloadFile=()=>{
    Storage.get(this.state.filename, this.state.file,{ expires: 60 })
    .then(()=>{
      console.log('sucessfulli donwloaded')
      this.setState({fileUrl: '', file: '', filename: ''})
    })

  }

  render(){
    return(
      <div className="Home12">
        <input type='file' onChange={this.handleChange}/>
        <img src={this.state.fileUrl} />
        <button onClick={this.saveFile}>save File</button>
        <button onClick={this.listFile}>list File</button>
        <button onClick={this.donwloadFile}>dowlaod file</button>
        </div>
    );
  }
}

export default Home