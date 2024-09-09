import { App } from "./app";
import { BookQuery } from "./controller/Books";
import { options } from "./data/connect";
import { orm } from "./data/database.orm";
import { seed } from "./data/seed";
import { Log } from "./middlewares/handler";
import { BookInfo } from "./models/book";

new App().app.listen(3000, () => {
  Log.info("Running Server");
});

// orm
//   .read<BookQuery, "Books">({
//     model: "Books",
//     conditions: {
//       limit: 10,
//       order: {
//         items: ["id"],
//         order: "ASC",
//       },
//     },
//   })
//   .then((data) => {
//     console.log(data);
//   });

// orm.delete({
//   model: "Books",
//   conditions: {
//     where: {
//       id: 799
//     }
//   }
// })

// orm.create({
//   data:   {
//     title: 'The Bourne Legacy',
//     subtitle: '',
//     authors: ["Eric Van Lustbader"],
//     categories: ["Fiction",'Horror'],
//     publishedDate: '2010-04-01',
//     description: "In Robert Ludlum's ground-breaking career, no other character so captured and held the world's imagination as Jason Bourne. He appeared in three of Robert Ludlum's own #1 bestselling novels - The Bourne Identity, The Bourne Supremacy, and The Bourne Ultimatum - and they remain amongst Ludlum's most-read and most-loved books to this day. Now, for the first time ever, the Estate of Robert Ludlum has acceded to the demands of readers around the world, turning to bestselling author Eric Van Lustbader to bring Jason Bourne back to life in a thrilling new novel. Jason Bourne is known and feared in the deadly world of covert-ops as one of the most highly skilled assassins for hire. Bourne, however, was merely an identity assumed by CIA agent David Webb, a personality implanted by the CIA to facilitate a dangerous operation, but one that threatened to subsume David Webb entirely. Years after the events of The Bourne Identity, Webb is no longer an active CIA agent and is now a professor of Eastern Studies at Georgetown University, living a quiet life, far from the dangers of his previous life. Until one day he finds himself the target of an assassin nearly as skilled as himself and is framed for the brutal murder of his two closest associates and friends. Fighting for his life against unseen assailants, as well as the full resources of the CIA who believe he has gone dangerously rogue, the Bourne identity asserts itself, leaving Jason Bourne in control. Now Bourne must use all his skills to stay alive as he battles against a determined assassin, the combined skills of the world's intelligence networks, and a shadowy figure in the background, skillfully manipulating events and people, in a far deadlier and more dangerous game than any of them realize.",
//     language: 'en',
//     averageRating: 4,
//     ratingsCount: 15,
//     price: '0.00'
//   },
//   model: "Books"
// })

// orm.update({
//   model: "Books",
//   conditions: {
//     where: 'id = 808'
//   },
//   data: {
//     title: 'The Bourne Legacy',
//     subtitle: 'Legacy',
//     publishedDate: '2022-04-01',
//     description: "",
//     language: 'en',
//     averageRating: 4,
//     ratingsCount: 15,
//     price: '10.00'
//   }
// })

// console.log("Books: ",seed.book);
// console.log("Avaible Books: ",seed.seedBooks);
