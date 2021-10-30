App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
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

  initContract: function() {
    $.getJSON("SupplyChain.json", function(supplyChain) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SupplyChain = TruffleContract(supplyChain);
      // Connect provider to interact with contract
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.reserveEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var supplyChainInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.SupplyChain.deployed().then(function(instance) {
      supplyChainInstance = instance;
      return supplyChainInstance.itemCount();
    }).then(function(itemCount) {
      var supplyChainResults = $("#supplyChainResults");
      supplyChainResults.empty();

      var itemsSelect = $('#itemsSelect');
      itemsSelect.empty();

      for (var i = 1; i <= itemCount; i++) {
        supplyChainInstance.items(i).then(function(item) {
          var id = item[0];
          var name = item[1];
          var quantityInitial = item[2];
          var quantitySold = item[3];
          var quantityInStock = item[4];

          // Render item Result
          var itemTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + quantityInitial + "</td><td>" + quantitySold + "</td><td>" + quantityInStock + "</td></tr>"
          supplyChainResults.append(itemTemplate);

          // Render item ballot option
          var itemOption = "<option value='" + id + "' >" + name + "</ option>"
          itemsSelect.append(itemOption);
        });
      }
      return supplyChainInstance.vendors(App.account);
    }).then(function(itemsBooked) {
      // Do not allow a vendor to reserve items if they already have booked 3 items
      if(itemsBooked >= 2) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  reserveQuantity: function() {
    var itemId = $('#itemsSelect').val();
    App.contracts.SupplyChain.deployed().then(function(instance) {
      return instance.reserveQuantity(itemId,2, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
