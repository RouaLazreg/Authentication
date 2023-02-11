const mongoose = require("mongoose")
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  encry_password: {
    type: String,
    required: true
  },
  
  //confirmation code 
  /*confirmationCode: { 
    type: String, 
    unique: true },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
,
//end confirmation code */

  salt: String, //A salt is a random piece of data that is used as an additional input to a one-way function that hashes data or a password
}, {timestamps: true})


userSchema.virtual("password")
  .set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.encry_password = this.securePassword(password)
  })
  .get(function() {
    return this._password
  })

  
userSchema.methods = {
  authenticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password
  },

  securePassword: function(plainpassword) {
    if(!plainpassword) return "";

    try {
      return crypto.createHmac("sha256", this.salt).update(plainpassword).digest("hex") //process of creating a hash value from some data, such as a password
    } catch (err) {
      return ""
    }
  }
}

module.exports = mongoose.model("User", userSchema)