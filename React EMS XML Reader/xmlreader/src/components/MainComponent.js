import React from 'react';
import ReactFileReader from 'react-file-reader';
import { Card, CardImg, CardText, CardBody, CardTitle, ReactFileReader } from 'reactstrap';
import './App.css';

function PsetReader(){
    return (
        handleFiles = files => {
            console.log(files)
          }
           
          <ReactFileReader handleFiles={this.handleFiles}>
            <button className='btn'>Upload</button>
          </ReactFileReader>
    )
}

