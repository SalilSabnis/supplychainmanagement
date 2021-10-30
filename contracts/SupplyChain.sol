pragma solidity >=0.4.22 <0.8.0;

contract SupplyChain {
    // Model a Item
     struct Item {
        uint id;
        string item_name;
        uint quantityInitial;
        uint quantitySold;
        uint quantityInStock;
    }


     // Store accounts that have voted
    mapping(address => uint) public vendors;

     // Read/write items
    mapping(uint => Item) public items;

     // Store item Count
    uint public itemCount;

      // reserve event
    event reserveEvent (
        uint indexed _itemId
    );

    // Constructor
    constructor () public {
        addItem("Item 1",10);
        addItem("Item 2",10);
        addItem("Item 3",10);
    }

    function addItem (string memory _name,uint initialQuantity) private {
        itemCount ++;
        items[itemCount] = Item(itemCount, _name, initialQuantity,0,initialQuantity);
    }

      function reserveQuantity (uint _itemId, uint _quantityToReserve) public {
     
         // require that the vendor has ordered max 5 times only
        require(vendors[msg.sender] <=2);

        // require a valid item
        require(_itemId > 0 && _itemId <= itemCount);

          // record that vendor has reserved an item
        vendors[msg.sender] = vendors[msg.sender]+ 1;



        // update item quantities
        items[_itemId].quantitySold ++;
        items[_itemId].quantityInStock = items[_itemId].quantityInitial - items[_itemId].quantitySold ;

        // trigger reserve event
        emit reserveEvent(_itemId);
      
    }
}