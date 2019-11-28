// client/src/App.js
import React, { Component } from "react";
import axios from 'axios';
class App extends Component {
  state ={
    data:[],
    id:0,
    message:null,
    intervalIsSet:false,
    idToDelete:null,
    idToUpdate:null,
    objectToUpdate: null
  };

  componentDidMount(){
    this.getDataFromDb();
    if(!this.state.intervalIsSet){
      let inetrval = setInterval(this.getDataFromDb,1000);
      this.setState({intervalIsSet:inetrval});
    }
  }
  componentWillMount(){
    if(this.state.intervalIsSet){
      clearInterval(this.state.intervalIsSet);
      this.setState({intervalIsSet:null});
    }
  }

  getDataFromDb = () =>{
    fetch('http://localhost:3001/api/getData')
    .then((data) => data.json())
    .then((res) => this.setState({ data: res.data}));
  }
  putDataToDB = (message)=>{
    let currentIDs = this.state.data.map((data)=> data.id);
    let idToBeAdded = 0;
    while(currentIDs.includes(idToBeAdded)){
      ++idToBeAdded;
    }
    axios.post('http://localhost:3001/api/putData',{
      id: idToBeAdded,
      message: message
    });
  };
  deleteFromDB = (idToDelete) =>{
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat)=>{
      if (dat.id == idToDelete){
        objIdToDelete = dat._id;
      }
    });
    axios.delete('http://localhost:3001/api/deleteData',{
      data: {
        id: objIdToDelete
      }
    });
  };
  updateFromDB =(idToUpdate) =>{
    parseInt(idToUpdate);

    this.state.data.forEach((dat) =>{
      if (dat.id == idToUpdate){
        
      }
    })
  }
  render(){
    const {data} = this.state;
    return(
      <div>
        <ul>
          {data.length<=0
            ? 'No Db Entries Yet'
            : data.map((dat)=>(
              <li style={{padding:'10px'}} key={data.id}>
                <span style={{color:'gray'}}>id:</span>{dat.id}<br/>
                <span style={{color:'gray'}}>data:</span>{dat.message};
                
              </li>
              )
            )
          }
        </ul>
        <div style={{padding:'10px'}}>
          <input
            type="text"
            onChange={(e)=>this.setState({message:e.target.value})}
            placeholder="add something in the database"
            style={{width:'200px'}}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{padding: '10PX'}}>
          <input
            type="text"
            style={{width:'200px'}}
            onChange ={(e) => this.setState({idToDelete: e.target.value})}
            placeholder = "enter an id which you want to delete"

          />
          <button onClick = {() => this.deleteFromDB(this.state.idToDelete)}>
            Delete
          </button>

        </div>
      </div>
    )
  }
}


export default App;