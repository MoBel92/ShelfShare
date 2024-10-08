import styles from "./Styles/page.module.css";
import { Card, CardHeader, CardMedia } from "@mui/material";
import Map from "./Components/Map";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <section className={styles.container}>
        <h2 className={styles.subheading}>Welcome to ShelfShare!</h2>
        <p className={styles.tag}>
          Discover and exchange books with fellow readers in your community.
        </p>
      </section>
      <section className={`${styles.container} ${styles.flexContainer}`}>
        <img
          className={`${styles.homepageImg} ${styles.flexItem}`}
          src="https://as2.ftcdn.net/v2/jpg/00/65/70/77/1000_F_65707740_9dy3kO5vd8NsuoN1vAmVuTHr82DvCUvB.jpg"
          alt="Bookshelf full of books"
        />
        
        <ul className={`${styles.orderList} ${styles.flexItem}`}>
      <section className={styles.container}>
        <p>
        <strong>How ShelfShare Works:</strong>
        </p>
          <li>1. Sign up and create a profile.</li>
          <li>2. List books you want to swap.</li>
          <li>3. Browse available books.</li>
          <li>4. Connect with other users.</li>
          <p>
          <strong>Select a book on the map 🖗</strong>
          </p>
          <Map />
      </section>
        </ul>
      </section>
      <section className={styles.container}>
        <h2 className={styles.subheading}>Available Books</h2>
        <p className={styles.tag}>
          Find books you may be interested in.
        </p>
        <section className={styles.bookCard}>

          <Link href='http://localhost:3000/books/66ced2c3cd7a0381694b5460'>
          <Card>
            <CardMedia
              component="img"
              image={
                "https://storage.googleapis.com/lr-assets/kids/covers/_hires_imported/9780141321134.jpg"
              }
              alt={"Book cover for Wind in the Willows novel"}
              className={styles.cardImage}
            />
            <CardHeader className={styles.tag} title={"Wind in the Willows"} />
            <h2 className={styles.tag}>Author: {"Kenneth Grahame"}</h2>
          </Card>
          </Link>
          <Link href='http://localhost:3000/books/66c74612d2576e500cf4756e'>
          <Card>
            <CardMedia
              component="img"
              image={
                "https://m.media-amazon.com/images/I/81q77Q39nEL._AC_UF894,1000_QL80_.jpg"
              }
              alt={"Book cover for Harry Potter and the Philosopher's Stone"}
              className={styles.cardImage}
            />
            <CardHeader
              className={styles.tag}
              title={"Harry Potter and the Philosopher's Stone"}
            />
            <h2 className={styles.tag}>Author: {"J.K.Rowling"}</h2>
          </Card>
          </Link>
          <Link href='http://localhost:3000/books/66cee48ecd7a0381694b55a6'>
          <Card>
            <CardMedia
              component="img"
              image={
                "https://i.ebayimg.com/images/g/PhUAAOSweNNgiphk/s-l600.jpg"
              }
              alt={"Book cover for The Da Vinci Code"}
              className={styles.cardImage}
            />
            <CardHeader className={styles.tag} title={"The Da Vinci Code"} />
            <h2 className={styles.tag}>Author: {"Dan Brown"}</h2>
          </Card>
          </Link>
        </section>
      </section>
    </div>
  );
};

export default Home;