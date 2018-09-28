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
    $.getJSON('FundChain.json', function (fundChain) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.FundChain = TruffleContract(fundChain);
      // Connect provider to interact with contract
      App.contracts.FundChain.setProvider(App.web3Provider);
      //App.listenForEvents();
      return App.render();
    });
  },


  render: function () {
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
        console.log('balance',balance);
      }
    });

    // Load contract data
    App.contracts.FundChain.deployed().then(function (instance) {
      fundChainInstance = instance;
      return {

      };
    }).then(function (fundChainDetails) {

      document.getElementById("relief-donate-button").addEventListener("click", function () {

        let donationAmt = document.getElementById("relief-amt-input").value;
        if (donationAmt) {
          //web3.eth.getAccounts().then(account=> {
          //console.log(account[0]);
          web3.eth.sendTransaction({
            from: currentAccount,
            to: '0x287CFb49ceBac74dd0b28Fa8dE3a4D0ecC8d3a7c',
            value: donationAmt,
          }, function (result) {
            console.log(result);
          });
          //});
        }

      });

      document.getElementById("relief-distribute-button").addEventListener("click", function () {

        let donationAmt = document.getElementById("relief-amt-input").value;
        if (donationAmt) {
          //web3.eth.getAccounts().then(account=> {
          //console.log(account[0]);
          
          web3.eth.sendTransaction({
            from: currentAccount,
            to: '0x287CFb49ceBac74dd0b28Fa8dE3a4D0ecC8d3a7c',
            value: donationAmt,
          }, function (result) {
            console.log(result);
          });
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
