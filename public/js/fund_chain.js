// document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('select');
//     var instances = M.FormSelect.init(elems, []);
//   });
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('../build/contracts/FundChain.json', function (fundChain) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.FundChain = TruffleContract(fundChain);
      // Connect provider to interact with contract
      App.contracts.FundChain.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents:function(){
    console.log('hey 1')
    App.contracts.FundChain.deployed().then(function (instance) {
      instance.updateDonationCompleteUI({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        console.log('hey')
        App.getData();
      });
    });
  },

  appInstance: null,

  getData: function () {
    appInstance.agentDonationCount().then(function (data) {
      console.log('data', data);
      document.getElementById("agent-relief-donation").innerText = (data.c[0] / Math.pow(10, 4)) || 0;
      document.getElementById("distributor-funds-received").innerText = (data.c[0] / Math.pow(10, 4)) || 0;
      document.getElementById("distributor-funds-spread").innerText = (data.c[0] / Math.pow(10, 4)) || 0;
      document.getElementById("received-fund-span").innerText = (data.c[0] / Math.pow(10, 4)) || 0;
    });
  },


  render: function () {
    var donationAmt=0;
    var fundChainInstance;
    var loader = $("#loadingRow");
    var content = $("#content");
    var currentAccount;
    var donorAccount = '0xE11D4E166069B474E1567F1A8c21db26bB9BCd74';
    var distributorAccount = '0xc31a645997a9617f96667EaE0561A340bC95e7B9';
    loader.show();
    content.hide();


    web3.eth.getCoinbase(function (err, account) {
      if (!err) {
        App.account = account;
        currentAccount = account;
        console.log('account', account);
        if (account.toLowerCase() === donorAccount.toLowerCase()) {
          console.log('reached 1')
          $("philatropy-div").show();
          $("distribute-div").hide();
        } else if (account.toLowerCase() === distributorAccount.toLowerCase()) {
          console.log('reached 2')
          $("philatropy-div").hide();
          $("distribute-div").show();
        }
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        var balance = web3.eth.getBalance(account);
        balance = web3.toDecimal(balance);
        balance = balance / Math.pow(10, 18)
        console.log('balance', balance);
      }
    });

    // Load contract data
    App.contracts.FundChain.deployed().then(function (instance) {
      fundChainInstance = instance;
      appInstance = instance;
      App.getData();
      return {
        agent: fundChainInstance.agent(),
        distributor: fundChainInstance.distributor(),
      };
    }).then(function (fundChainDetails) {

      //console.log(fundChainDetails);
      fundChainDetails.agent.then(function (data) {
        document.getElementById("agent-name").innerText = data[0];
        document.getElementById("agent-description").innerText = data[1];
        document.getElementById("agent-image").setAttribute("src",data[2]);
        document.getElementById("agent-address").innerText = data[3];
      });

      fundChainDetails.distributor.then(function (data) {
        document.getElementById("distributor-name").innerText = data[0];
        document.getElementById("distributor-acc").innerText = data[2];
      });

      document.getElementById("relief-donate-button").addEventListener("click", function () {

        let donationAmt = document.getElementById("relief-amt-input").value;
        if (donationAmt) {
          //web3.eth.getAccounts().then(account=> {
          //console.log(account[0]);
          console.log(donationAmt)
          web3.eth.sendTransaction({
            from: currentAccount,
            to: '0xc31a645997a9617f96667EaE0561A340bC95e7B9',
            value: parseFloat(donationAmt),
          }, function (err,result) {
            console.log(result)
            console.log(err);
            fundChainInstance.updateDistributorFund(parseFloat(donationAmt) || 0)
          });
          //});
        }

      });

      //document.getElementById("received-fund-span").innerText=
      document.getElementById("relief-distribute-button").addEventListener("click", function () {

        let receivedAmt = parseFloat(document.getElementById("received-fund-span").innerText) || 0;
        console.log(receivedAmt)
        if (receivedAmt) {
          //web3.eth.getAccounts().then(account=> {
          //console.log(account[0]);
          let userList = document.getElementById("end-user-ol");
          userList.innerText = "";
          for (let i = 0; i < 5; i++) {
            fundChainInstance.endUserSupplyChains(i).then(function (user) {
              console.log(user[2])
              web3.eth.sendTransaction({
                from: currentAccount,
                to: user[2],
                value: receivedAmt * Math.pow(10, 18) / 5,
              }, function (err,result) {
                console.log(err);
                console.log(result);
                appInstance.distributeFunds(i, receivedAmt);
                fundChainInstance.endUserSupplyChains(i).then(function (u) {

                  let li = document.createElement("li");
                  let img = document.createElement("img");
                  img.className = "cicle";
                  img.src = u[1];
                  let name = document.createElement("strong");
                  name.innerText = u[0];
                  let strong = document.createElement("strong");
                  strong.innerText = "Public Ethereum Account: "
                  let span = document.createElement("span");
                  span.innerText = u[2];
                  let strong2 = document.createElement("strong");
                  strong2.innerText = "Amount Recieved: "
                  let span2 = document.createElement("span");
                  span2.innerText = parseFloat(receivedAmt)/5;
                  li.appendChild(img);
                  li.appendChild(document.createElement("br"));
                  li.appendChild(name);
                  li.appendChild(document.createElement("br"));
                  li.appendChild(strong);
                  li.appendChild(span);
                  li.appendChild(document.createElement("br"));
                  li.appendChild(strong2);
                  li.appendChild(span2);
                  userList.appendChild(li);
                });
              });
            });
          }

          // web3.eth.sendTransaction({
          //   from: currentAccount,
          //   to: '0x287CFb49ceBac74dd0b28Fa8dE3a4D0ecC8d3a7c',
          //   value: donationAmt,
          // }, function (result) {
          //   console.log(result);
          // });
          //});
        }

      });

      loader.hide();
      content.show();
    }).catch(function (error) {
      console.warn(error);
    });


  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
