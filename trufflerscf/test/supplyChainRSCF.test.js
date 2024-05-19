const { assert } = require('chai');
const SupplyChainRSCF = artifacts.require("./SupplyChainRSCF.sol");
const TypeRSCF = artifacts.require("./TypeRSCF.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('SupplyChainRSCF', ([buyer, seller, logistics,importer]) => {
    let supplyChainRSCF
  
    before(async () => {
        supplyChainRSCF = await SupplyChainRSCF.deployed()
    })

    describe('deployment' , async() => {
        it('should deploy' , async() => {

            let address = supplyChainRSCF.address
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
    })

    describe('product' , async() => {

        it('should add product' , async() => {

            // const result = await supplyChainRSCF.addProduct("888", "product1" , "manu", "testProduct", "location1")
            const result = await supplyChainRSCF.addGoodRSCF({
                 goodRSCFName: "product1",
                 goodRSCFId: "888",
                 manufacturerName: "manu",
                 manufacturer: supplyChainRSCF.address,//address
                 batchCount: 10,
                 expDateEpoch: 1001,
                 manDateEpoch: 1002,
                 goodRSCFType: "1",
                 categoryName: "fish",      
                 goodRSCFHistory: {
                   manufacturer: {
                    clientId: "manufacturer",  
                    date: 101005
                   },
                   supplier: {
                    clientId: "supplier",  
                    date: 101005
                   },
                   retailer:  {
                    clientId: "retailer",  
                    date: 101005
                   },
                   customers: {
                    clientId: "customers",  
                    date: 101005
                   },
                 },
                 composition: ["1"],
                 sideEffects: ["1"],              
                },
                101005 //time
            )
            const event = result.logs[0].args;
        //    assert.equal( event.name, "product1")
        //    assert.equal( event.owner , seller)
        })

        // it('should add new location' , async() => {
        //     let address = supplyChainRSCF.address
        //     console.log("changeLocoation: address " + address)
        //     // changeLocoation: address 0x009278Cfea93587403af5613D0191513256F9244
        //     // const result1 = await supplyChainRSCF.changeLocation( 'new fright hub' , 1 , { from: importer})
        //     //const result1 = await supplyChainRSCF.changeLocation('0x047d88ca83bd2ba8166ec20bf31a027d2d5e544d', 1 , address)
        //     const result1 = await supplyChainRSCF.changeLocation( 'new fright hub' , 0 , address)
        //     const event1 = result1.logs[0].args
        //     // assert.equal(event1.id.toNumber(),1)
        //     // assert.equal(event1.currentLocation, 'new fright hub')
        // })

        it("getSingleGoodRSCF() should return info" , async() => {
            // const result3 = await supplyChainRSCF.fetchProductInfo("888" ,{from:buyer})
            const result3 = await supplyChainRSCF.getSingleGoodRSCF("888")
            // const event3  = result3.logs[0].args
            console.log("getSingleGoodRSCF result:"+result3)
        })
    })
})