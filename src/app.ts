import { DepositeController } from './controller/deposite';
import { ProductController } from './controller/product';
import { isTokenValid } from './middleware/authontication';
import { UserController } from './controller/user';
import { LoginController } from './controller/login';
import express from "express"
import 'dotenv/config'
import { connect } from "mongoose"
import { take } from 'rxjs';



const cors = require("cors")
const app = express()
app.use(express.json());
app.use(cors())


const coinsArray = [5, 10, 20, 50, 100]

// ---------------------------------------------------------LogIn----------------------------------------------------------------------------
app.post("/login/employee", (req, res) => {
  const p = LoginController.UserLogIn(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(401)
      }
    }
  )
})
// ---------------------------------------------------------signUp----------------------------------------------------------------------------

app.post("/signup", (req, res) => {
  const p = UserController.createUser(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(400)
      }
    }
  )
})
//-------------------------------------------------------------User-------------------------------------------------------------------------------------------
app.get("/user/:id", isTokenValid, (req, res) => {
  const p = UserController.findUser(req.params.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(401)
      }
    }
  )
})
//-------------------------------------------------------------User-------------------------------------------------------------------------------------------
app.get("/users/all/:pn", isTokenValid, (req, res) => {
  const p = UserController.findAllUserPagination(Number(req.params.id)).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(401)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.put("/user/:id", isTokenValid, (req, res) => {
  if (req.user.id === req.params.id) {

    const p = UserController.updateUser(req.params.id, req.body).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(401)
        }
      }
    )
  } else {
    res.sendStatus(403)
  }

})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete("/user/:id", isTokenValid, (req, res) => {
  if (req.user.id === req.params.id) {

    const p = UserController.deleteUser(req.params.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(401)
        }
      }
    )
  } else {
    res.sendStatus(403)
  }

})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------signUp----------------------------------------------------------------------------
app.post("/product", isTokenValid, (req, res) => {
  console.log(req.user)
  if (req.user.role === "seller") {
    const p = ProductController.createProduct(req.body, req.user.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(400)
        }
      }
    )

  } else {
    res.sendStatus(403)
  }

})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.put("/product/:id", isTokenValid, (req, res) => {
  if (req.user.role === "seller") {
    const p = ProductController.updateProduct(req.params.id, req.user.id, req.body).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(400)
        }
      }
    )

  } else {
    res.sendStatus(403)
  }

})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete("/product/:id", isTokenValid, (req, res) => {
  if (req.user.role === "seller") {
    const p = ProductController.deleteProduct(req.params.id, req.user.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(404)
        }
      }
    )

  } else {
    res.sendStatus(403)
  }

})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/products/all/:pn", isTokenValid, (req, res) => {

  const p = ProductController.findAllProductPagination(Number(req.params.pn)).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )

})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------deposit----------------------------------------------------------------------------
app.get("/deposite/add/:coins", isTokenValid, (req, res) => {
  const coins = Number(req.params.coins)
  if (req.user.role === "buyer" && coinsArray.includes(coins)) {
    const p = DepositeController.addCoinsToAccount(req.user.id, coins).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(404)
        }
      }
    )
  } else {
    res.status(400).json({ message: "only buyers can add coins and coins must be 5, 10, 20, 50 , 100" })
  }


})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/product/buy", isTokenValid, (req, res) => {

  if (req.user.role === "buyer") {
    const p = DepositeController.purchaseProduct(req.body.productId, req.body.amount, req.user.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          switch (e) {
            case 1:
              res.status(400).json({ message: "please add coins to your deposit" })
              break
            case 2:
              res.status(400).json({ message: "amount available of this product is not enough" })
              break
            default:
              res.sendStatus(400)

          }

        }
      }
    )
  } else {
    res.sendStatus(403)
  }
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/deposit/reset/:id", isTokenValid, (req, res) => {

  if (req.user.id === req.params.id) {
    const p = DepositeController.resetDeposit(req.user.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(404)
        }
      }
    )
  } else {
    res.sendStatus(403)
  }
})

//--------------------------------------------------------------------------------------------------------------------------------------------------------





const PORT = process.env.PORT || 3000

const start = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI || "")
    app.listen(PORT, () => {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();