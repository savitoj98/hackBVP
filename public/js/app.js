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
    //../build/contracts/Auction.json
    $.getJSON('../build/contracts/Auction.json', function (auction) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Auction = TruffleContract(auction);
      // Connect provider to interact with contract
      App.contracts.Auction.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  listenForEvents: function () {
    App.contracts.Auction.deployed().then(function (instance) {
      instance.highestBidSubmitted({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function (error, event) {
        //refresh
        //App.render();

        instance.highestBid().then(function (data) {
          //getting data.c[0] as eth-value*1000
          document.getElementById("highest-bid").innerText = 'ETH ' + data.c[0] / Math.pow(10, 4);
        })

        instance.highestBidder().then(function (data) {
          console.log(data);
          document.getElementById("highest-bidder").innerText = data;
        })
      });
    });
  },

  render: function () {
    var auctionInstance;
    var loader = $("#loadingRow");
    var content = $("#content");
    var currentAccount;
    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        currentAccount = account;
        console.log('account', typeof (account))
        console.log('account:', account);
        document.getElementById('account-span').innerText = account;
        const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
        var balance = web3.eth.getBalance(account);
        balance = web3.toDecimal(balance);
        let accountBalance = balance / Math.pow(10, 18)
        console.log(balance);
        document.getElementById('balance-span').innerText = accountBalance;
      }
    });

    // Load contract data
    App.contracts.Auction.deployed().then(function (instance) {
      auctionInstance = instance;
      return {
        auctioner: auctionInstance.auctioner(),
        beneficiary: auctionInstance.beneficiary(),
        item: auctionInstance.auctionItem(),
        highestBid: auctionInstance.highestBid(),
        highestBidder: auctionInstance.highestBidder(),
      };
    }).then(function (auctionDetails) {

      auctionDetails.auctioner.then(function (data) {
        //This did not work for some reason and henceforth,
        //$('#auctioner-name').innerText=data[0];

        document.getElementById('auctioner-name').innerText = data[0];
        document.getElementById('auctioner-description').innerText = data[1];
        document.getElementById('auctioner-image').setAttribute('src', data[2]);
      });


      // auctionDetails.beneficiary.then(function (data) {
      //   document.getElementById('beneficiary-name').innerText = data[0];
      //   document.getElementById('beneficiary-link').innerText = data[2];
      //   document.getElementById('beneficiary-link').setAttribute('href', data[2]);
      //   document.getElementById('beneficiary-image').setAttribute('src', data[1]);
      // });

      auctionDetails.item.then(function (data) {
        document.getElementById('item-name').innerText = data[1];
        document.getElementById('item-catalog').innerText = data[0];
        document.getElementById('item-image').setAttribute('src', data[2]);
      });

      auctionDetails.highestBidder.then(function (data) {
        document.getElementById('highest-bidder').innerText = data[0];
      });

      auctionDetails.highestBid.then(function (data) {
        document.getElementById('highest-bid').innerText = data[0];
      });

      document.getElementById('bid-submit-button').addEventListener('click', () => {
        console.log('clicked');
        let bidValue = document.getElementById('bid-input').value;
        if (bidValue) {

          auctionInstance.bid({
            from: currentAccount,
            to: '0x56C10FC821263340f0DfAaD42BE565F34e85F537',
            gas: 3000000,
            value: bidValue,
          }).then(function (result) {
            //var balance = web3.eth.getBalance('0x56C10FC821263340f0DfAaD42BE565F34e85F537');
            //balance = web3.toDecimal(balance);
            //let accountBalance = balance / Math.pow(10, 18)

            //console.log(accountBalance);

            let highestBid = auctionInstance.highestBid();
            let highestBidder = auctionInstance.highestBidder();
            highestBid.then(function (data) {
              document.getElementById('highest-bidder').innerText = data[0];
            });

            highestBidder.then(function (data) {
              document.getElementById('highest-bid').innerText = data[0];
            });

          })
           

          // web3.eth.sendTransaction({
          //   from: currentAccount,
          //   to: '0x31f9Aae8434Bb4A09d969871CDd59A5B12E90d5f',
          //   value: bidValue,
          // }, function (result) {
          //   //var balance = web3.eth.getBalance('0x56C10FC821263340f0DfAaD42BE565F34e85F537');
          //   //balance = web3.toDecimal(balance);
          //   //let accountBalance = balance / Math.pow(10, 18)

          //   //console.log(accountBalance);

          //   let highestBid = auctionInstance.highestBid();
          //   let highestBidder = auctionInstance.highestBidder();
          //   highestBid.then(function (data) {
          //     document.getElementById('highest-bidder').innerText = data[0];
          //   });

          //   highestBidder.then(function (data) {
          //     document.getElementById('highest-bid').innerText = data[0];
          //   });

          // });
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
