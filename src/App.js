import React, { Component } from "react";

import "./App.css";

const options1 = { minimumFractionDigits: 2 };
const formatNumber = (number) => new Intl.NumberFormat("en-IN", options1).format(number);
const sortOn = (arr, prop) => arr.sort(
  function (a, b) {
    // console.log(a, b);
    if (a[prop] < b[prop]) {
      return -1;
    } else if (a[prop] > b[prop]) {
      return 1;
    } else {
      return 0;
    }
  }
);

class App extends Component {

  state = {
    stores: [],
    finalRevenue: 0,
    filtered: []
  }

  componentDidMount() {
    Promise.all([
      fetch('http://localhost:3000/api/branch1.json'),
      fetch('http://localhost:3000/api/branch2.json'),
      fetch('http://localhost:3000/api/branch3.json')
    ]).then(responses => {
      // console.log(responses);
      return Promise.all(responses.map(function (response) {
        return response.json();
      }));
    }).then(data => {
      // console.log(data);
      const branch1 = data[0].products;
      const branch2 = data[1].products;
      const branch3 = data[2].products;


      const all = [branch1, branch2, branch3];
      // console.log(all[0]);
      // console.log(all[1]);
      // console.log(all[2]);
      // console.log(all);
      let unsorted = [];
      let finalProducts = [];
      for (let i = 0; i < all.length; i++) {
        for (let j = 0; j < all[i].length; j++) {
          unsorted.push(
            {
              name: all[i][j].name,
              revenue: all[i][j].unitPrice * all[i][j].sold
            });
        }
      }
      // console.log(unsorted);
      sortOn(unsorted, "name");
      // console.log(unsorted);

      var holder = {};
      for (let i = 0; i < unsorted.length; i++) {
        holder[unsorted[i].name] = unsorted[i].revenue;
      }

      // console.log(holder);
      for (var prop in holder) {
        finalProducts.push({ name: prop, revenue: holder[prop] });
      }
      // console.log(finalProducts);


      this.setState({ stores: finalProducts });
      console.log("componentDidMount function");
    }).catch(error => {

      // if there's an error, print on the console

      console.log(error);
    });
  }

  getValueInput = (e) => {

    const inputValue = e.target.value;
    let finalStore = this.state.stores;
    this.setState({
      filtered: finalStore.filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()))
    });
  }


  displayTotalRev() {

    let finalStore = this.state.stores;
    let filteredStore = this.state.filtered;
    let sum;

    if (filteredStore.length === 0) {
      finalStore.reduce(function (prev, current) {
        // console.log(prev, current);
        sum = prev + current.revenue;
        return sum
      }, 0);
    } else {
      filteredStore.reduce(function (prev, current) {
        // console.log(prev + " " + current);
        sum = prev + current.revenue;
        return sum
      }, 0);
    }

    return (
      <tr>
        <td>Total</td>
        <td>{formatNumber(sum)}</td>
      </tr>
    )
  }

  renderTableData() {

    let filteredStore = this.state.filtered;
    // console.log(filteredStore, "1");

    let finalStore = this.state.stores;
    // console.log(finalStore, "2");

    if (filteredStore.length === 0) {
      return finalStore.map((store) => {
        return (
          <tr key={store.name}>
            <td>{store.name}</td>
            <td>{formatNumber(store.revenue)}</td>
          </tr>
        )
      })
    } else {
      return filteredStore.map((store) => {

        return (
          <tr key={store.name}>
            <td>{store.name}</td>
            <td>{formatNumber(store.revenue)}</td>
          </tr>
        )
      })
    }
  }

  render() {
    console.log("render fuction");
    return (
      <div className="product-list">
        <input type="text" onChange={this.getValueInput} placeholder="Search for Product"></input>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTableData()}
          </tbody>
          <tfoot>
            {this.displayTotalRev()}
          </tfoot>
        </table>
      </div>
    );
  }
}

export default App;