import mongoose, { Mongoose } from "mongoose";
import { BookAllotmentHistory } from "../models/bookallotmentHistory.js";
import { BookManagement } from "../models/book.management.js";
import { SubscriptionType } from "../models/subscriptionType.model.js";
import { RegisterManagement } from "../models/register.management.js";
const ObjectId = mongoose.Types.ObjectId;

// export const bookAllotmentHistory = async (req, res) => {
//   const { studentId, bookDetails } = req?.body;

//   try {
//     if (!ObjectId.isValid(studentId)) {
//       return res.status(400).json({ error: "Invalid studentId provided." });
//     }

//     // let history = await BookAllotmentHistory.findOne({ studentId });

//     // if (history) {
//     let history = new BookAllotmentHistory({
//       studentId,
//       count: bookDetails.length,
//       allotmentDetails: bookDetails,
//     });
//     // } else {
//     //   history.count += bookDetails.length;
//     //   history.allotmentDetails.push(...bookDetails);
//     // }

//     await history.save();
//     return res
//       .status(200)
//       .json({ message: "Allotment history saved successfully!" });
//   } catch (error) {
//     console.error("Error saving allotment history:", error);
//     return res.status(500).json({ error: "Failed to save allotment history." });
//   }
// };

export const bookAllotmentHistory = async (req, res) => {
  const { studentId, bookDetails } = req?.body;
  console.log(`req?.body`, req?.body);

  console.log(`studentId`, studentId);

  try {
    // if (!ObjectId.isValid(studentId)) {
    //   return res.status(400).json({ error: "Invalid studentId provided." });
    // }

    // let history = await BookAllotmentHistory.findOne({ studentId });

    // if (history) {
    //   history.count += bookDetails.length;
    //   history.allotmentDetails.push(...bookDetails);
    // } else {
    let history = new BookAllotmentHistory({
      studentId,
      //   count: bookDetails.length,
      allotmentDetails: bookDetails,
    });
    // }

    await history.save();

    return res
      .status(200)
      .json({ message: "Allotment history saved successfully!" });
  } catch (error) {
    console.error("Error saving allotment history:", error);
    return res.status(500).json({ error: "Failed to save allotment history." });
  }
};

export const getBookAllotmentHistory = async (req, res) => {
  try {
    const histories = await BookAllotmentHistory.aggregate([
      {
        $lookup: {
          from: "registermanagements",
          localField: "studentId",
          foreignField: "_id",
          as: "studentDetails",
        },
      },
    ]);
    // console.log("histories>>>>>>", histories);

    if (!histories || histories.length === 0) {
      return res
        .status(404)
        .json({ error: "No allotment history found for any student." });
    }

    return res.status(200).json({
      message: "Allotment history retrieved successfully!",
      histories,
    });
  } catch (error) {
    console.error("Error retrieving allotment history:", error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve allotment history." });
  }
};

// export const getBookDetailHistoryStudentId = async (req, res) => {
//   const { id } = req?.params;
//   console.log("Student Id", id);

//   try {
//     const findStudent = await BookAllotmentHistory.findById({
//       _id: new ObjectId(id),
//     });
//     if (findStudent) {
//       console.log(`findStudent`, findStudent?.allotmentDetails);
//       findStudent?.allotmentDetails?.map((item, index) => {
//         console.log(`item`, item.bookId);
//       });
//     }

//     const data = await BookAllotmentHistory.aggregate([

//     ]);

//     console.log("dtat==================", data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching student history.", error });
//   }
// };

export const getBookDetailHistoryStudentId = async (req, res) => {
  const { id } = req?.params;
  try {
    const data = await BookAllotmentHistory.findById(id);

    if (!data) {
      return res
        .status(404)
        .json({ message: "No history found for this student." });
    }
    const studentDetails = await RegisterManagement.findById(data.studentId);
    if (!studentDetails) {
      return res.status(404).json({ message: "Student not found." });
    }
    const allotmentDetails = await Promise.all(
      data.allotmentDetails.map(async (item) => {
        const bookDetails = await BookManagement.findById(item.bookId);
        if (!bookDetails) {
          console.log(`Book not found for Book ID: ${item.bookId}`);
        }
        const paymentDetails = await SubscriptionType.findById(item.paymentId);
        if (!paymentDetails) {
          console.log(`Payment not found for Payment ID: ${item.paymentId}`);
        }
        return {
          ...item.toObject(),
          bookDetails: bookDetails || null,
          paymentDetails: paymentDetails || null,
        };
      })
    );
    return res.status(200).json({
      studentDetails,
      allotmentDetails,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error fetching student history.", error });
  }
};

// export const getBookDetailHistoryStudentId = async (req, res) => {
//   const { id } = req?.params;
//   console.log("Student Id", id);

//   try {
//     const data = await BookAllotmentHistory.aggregate([
//       {
//         $match: {
//           studentId: new mongoose.Types.ObjectId("6773877797c3fefb38c44e3a"),
//         },
//       },
//       { $unwind: "$allotmentDetails" },
//       {
//         $lookup: {
//           from: "BookManagement",
//           localField: "allotmentDetails.bookId",
//           foreignField: "_id",
//           as: "bookingDetails",
//         },
//       },
//       {
//         $unwind: { path: "$bookingDetails", preserveNullAndEmptyArrays: true },
//       },
//       {
//         $project: {
//           _id: 1,
//           "allotmentDetails.bookId": 1,
//           "bookingDetails.title": 1,
//         },
//       },
//     ]);

//     console.log("Aggregated Data:", data);

//     if (data.length > 0) {
//       res.status(200).json({ message: "Student Book History Found", data });
//     } else {
//       res.status(404).json({ message: "No history found for this student." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching student history.", error });
//   }
// };

// export const getBookDetailHistoryStudentId = async (req, res) => {
//   const { id } = req?.params;
//   console.log("Student Id", id);

//   try {
//     const data = await BookAllotmentHistory.aggregate([
//       {
//         $match: {
//           studentId: new mongoose.Types.ObjectId("6773877797c3fefb38c44e3a"),
//         },
//       },
//       { $unwind: "$allotmentDetails" },
//       //   {
//       //     $lookup: {
//       //       from: "BookManagement",
//       //       localField: "allotmentDetails.bookId",
//       //       foreignField: "_id",
//       //       as: "bookingDetails",
//       //     },
//       //   },
//       //   {
//       //     $unwind: {
//       //       path: "$bookingDetails",
//       //       preserveNullAndEmptyArrays: true,
//       //     },
//       //   },
//       //   {
//       //     $project: {
//       //       _id: 1,
//       //       allotmentDetails: 1,
//       //       "bookingDetails.title": 1,
//       //       // "bookingDetails.author": 1,
//       //       // "bookingDetails.publicationYear": 1,
//       //     },
//       //   },
//     ]);

//     console.log("Aggregated Data:", data);

//     if (data.length > 0) {
//       res.status(200).json({ message: "Student Book History Found", data });
//     } else {
//       res.status(404).json({ message: "No history found for this student." });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching student history.", error });
//   }
// };
