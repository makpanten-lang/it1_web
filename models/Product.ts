import mongoose, { Model, Schema, Types } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: Types.ObjectId;
  imageUrl: string;
  imagePublicId: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "𝐏𝐥𝐞𝐚𝐬𝐞 𝐞𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐩𝐫𝐨𝐝𝐮𝐜𝐭 𝐧𝐚𝐦𝐞"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "𝐄𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐬𝐥𝐮𝐠"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    description: {
      type: String,
      required: [true, "𝐄𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐩𝐫𝐨𝐝𝐮𝐜𝐭 𝐝𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "𝐄𝐧𝐭𝐞𝐫 𝐭𝐡𝐞 𝐩𝐫𝐢𝐜𝐞"],
      min: [0, "𝐏𝐫𝐢𝐜𝐞 𝐜𝐚𝐧𝐧𝐨𝐭 𝐛𝐞 𝐥𝐞𝐬𝐬 𝐭𝐡𝐚𝐧 𝟎"],
    },

    stock: {
      type: Number,
      required: true,
      min: [0, "𝐐𝐮𝐚𝐧𝐭𝐢𝐭𝐲 𝐜𝐚𝐧𝐧𝐨𝐭 𝐛𝐞 𝐥𝐞𝐬𝐬 𝐭𝐡𝐚𝐧 𝟎"],
      default: 0,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "𝐒𝐞𝐥𝐞𝐜𝐭 𝐚 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐲"],
    },

    imageUrl: {
      type: String,
      required: [true, "𝐔𝐩𝐥𝐨𝐚𝐝 𝐚 𝐩𝐫𝐨𝐝𝐮𝐜𝐭 𝐢𝐦𝐚𝐠𝐞"],
    },

    imagePublicId: {
      type: String,
      required: true,
    },

    published: {
      type: Boolean, //ฺBoolean จริงกับเท็จ 0/1
      default: true, //ค่าเริ่มต้นเป็น จริง
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: "text",
  description: "text",
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;