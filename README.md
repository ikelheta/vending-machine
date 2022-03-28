# vending-machine
## summary


### Simple vending-machine app created with node Typescript (express), rxjs and mongoDb
### using Object oriented design pattern



## Installation
1 - install node
2 - npm install -g typescript
3 - npm instal
4 - npm run dev

## EndNodes
```
1 - url/login/user
method: POST
  body: {userName: string, password: string}
  res : {token : "", id:""}
```
```
2 - url/signup
method: POST
  body: {
  "userName": "",
  "password": "",
  "role": ""}
  
  res : {token: "", id:""}
 ```
 ```
 3 - url/user/:id
 method: GET
 must be logged in
 ```
 ```
 4 - url/users/all/:pn
 pn => pageNumber
  method: GET
 must be logged in
 res :{
 data: 10 users,
 colSize: allUser.count
 } 
 

 ```
 ```
 5 - url/user/:id
   method: PUT
   body: updated object cant update deposit
   must bes logged in and update only your account
 ```
 
 ```
 6 - url/user/:id
 method: DELETE
  must bes logged in and delete only your account

 ```
 
 ```
 7 - URL/product
 method : POST
   must bes logged in and your role is seller
   body: { amountAvailable: number,
  cost: number,
  productName: string,}
sellerId comes from your token

 ```
 
 ```
 8 - url/product/:id
 method :PUT
    body: {updated object }
       must bes logged in and have the same id in product sellerId


 ```
```
9 url/product/:id
method: DELETE
must bes logged in and have the same id in product sellerId
```

```
10 URL/products/all/:pn
pn => pageNumber
  method: GET
  must be logged in
  res :{
 data: 10 products,
 colSize: allProducts.count
 } 
```

```
11 url/deposite/add/:coins
method : GET
  must be logged in and your role is buyer and coins = 5 || 10 || 20 || 50 || 100
```
```
12 - url/product/buy
method :post
body :{ 
"productId": "",
    "amount":number}
  must be logged in and your role is buyer and have deposite enough to  buy productCost * amount && 
  productAmount > amount
  
  function substract cost * amount and added it to sellerId deposit
  
```

```
13 - url/deposit/reset/:id
method: POST
must be logged in and have the same id req.params.id

```
