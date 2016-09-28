var db = 0;
var result;
var deleteQuery;
var selectedQuantity;
var prID;
function createDB() {
    if (!db) {
        db = window.openDatabase("Products", "1.0", "Diesel Cult", 2 * 1024 * 1024);
    }
    db.transaction(populateDB, errorCB, successCreateCB);
}

function populateDB(tx) {
    var sql = "CREATE TABLE IF NOT EXISTS product ( " +
            "id INTEGER NOT NULL, " +
            "productName VARCHAR(100), " +
            "productDescription VARCHAR(1000), " +
            "miles VARCHAR(50), " +
            "quantity INTEGER, " +
            "image VARCHAR(500)," +
            "pay INTEGER," +
            "user_id VARCHAR(100)," +
            "PRIMARY KEY(id,user_id))";
    tx.executeSql(sql, null, function () {
    },
            function (tx, error) {
                console.log('Create table error: ' + error.message);
            });
}

function errorCB(err) {
    console.log("Error processing SQL:" + err.code);
}
function successCreateCB() {
    console.log("Database has been created successfully");
}

function querySuccess(tx, results) {
    result = results;
}

function queryDB(tx) {
    var sql = "SELECT * FROM product WHERE user_id=" + localStorage.getItem("customer_id");
    tx.executeSql(sql, [], querySuccess, errorCB);
}

function queryInsert(tx) {
    var product = localStorage.getObject("product");
    var sql = "INSERT OR REPLACE INTO product " +
            "(id, productName, productDescription, miles, quantity, image,pay,user_id) " +
            "VALUES (?, ?, ?, ?, ?, ?,?,?)";
    tx.executeSql(sql, [product.id, product.name, product.description, product.styleMiles, selectedQuantity, product.image, selectedQuantity * product.styleMiles, localStorage.getItem("customer_id")],
            function () {
                console.log('INSERT success');
            },
            function (tx, error) {
                console.log('INSERT error: ' + error.message);
            });
}

function getSqlResultSet(success) {
    if (!db) {
        db = window.openDatabase("Products", "1.0", "Diesel Cult", 200000);
    }
    db.transaction(queryDB, errorCB, function () {
        success();
    });
}

function setData(quantity, success) {
    selectedQuantity = quantity;
    if (!db) {
        db = window.openDatabase("Products", "1.0", "Diesel Cult", 200000);
    }
    db.transaction(queryInsert, errorCB, function () {
        success();
    });
}

function removeCartProduct(productId, success) {
    deleteQuery = "DELETE FROM product WHERE id =" + productId + " AND user_id=" + localStorage.getItem("customer_id");
    if (!db) {
        db = window.openDatabase("Products", "1.0", "Diesel Cult", 200000);
    }
    db.transaction(queryRemove, errorCB, function () {
        success();
    });
}
function queryRemove(tx) {
    tx.executeSql(deleteQuery, [], querySuccess, errorCB);
}

function removeCart(success) {
    if (!db) {
        db = window.openDatabase("Products", "1.0", "Diesel Cult", 200000);
    }
    db.transaction(queryRemoveCart, errorCB, function () {
        success();
    });
}

function queryRemoveCart(tx) {
    var executeQuery = "DELETE FROM product";
    tx.executeSql(executeQuery, [], querySuccess, errorCB);
}

function getProduct(productID, success) {
    prID = productID;
    if (!db) {
        db = window.openDatabase("Products", "1.0", "Diesel Cult", 200000);
    }
    db.transaction(queryToGetProduct, errorCB, function () {
        success();

    });
}

function queryToGetProduct(tx) {
    var sql = "SELECT * FROM product WHERE user_id=" + localStorage.getItem("customer_id") + " AND id=" + prID;
    tx.executeSql(sql, [], querySuccess, errorCB);
}