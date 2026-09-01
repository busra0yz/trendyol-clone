const User = require('./User');
const Product = require('./Product');
const Category = require('./Category');
const Brand = require('./Brand');
const ProductVariant = require('./ProductVariant');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Address = require('./Address');
const Review = require('./Review');
const Favorite = require('./Favorite');


User.hasMany(Category, { foreignKey: 'userId' });    //User 1'e çok kategori oluşturabilir.
Category.belongsTo(User, { foreignKey: 'userId' });   //Category 1'e 1 user aittir.


User.hasMany(Brand, { foreignKey: 'userId' }); //User 1'e çok marka oluşturabilir.
Brand.belongsTo(User, { foreignKey: 'userId' }); //Brand 1'e 1 user aittir.


User.hasMany(Product, { foreignKey: 'userId' });
Product.belongsTo(User, { foreignKey: 'userId' });


Category.hasMany(Product, { foreignKey: 'categoryId' });
Product.belongsTo(Category, { foreignKey: 'categoryId' }); // product.getCategory() → ürünün kategorisi


Brand.hasMany(Product, { foreignKey: 'brandId' });
Product.belongsTo(Brand, { foreignKey: 'brandId' });


Product.hasMany(ProductVariant, { foreignKey: 'productId' });
ProductVariant.belongsTo(Product, { foreignKey: 'productId' });


User.hasMany(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });


Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });


Product.hasMany(CartItem, { foreignKey: 'productId' });
CartItem.belongsTo(Product, { foreignKey: 'productId' }); // cartItem.getProduct() → sepetteki ürünün detayları


User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });


Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });


Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });


User.hasMany(Address, { foreignKey: 'userId' });
Address.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' }); // review.getUser() → yorumu yazan kişi

Product.hasMany(Review, { foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });


User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Favorite, { foreignKey: 'productId' });
Favorite.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
    User,
    Product,
    Category,
    Brand,
    ProductVariant,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Address,
    Review,
    Favorite,
};