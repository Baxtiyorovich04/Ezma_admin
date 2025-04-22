import { useNavigate } from 'react-router-dom';
import { Book } from '../../hooks/useGetBooks';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (book.id) {
      navigate(`/books/${book.id}`);
    }
  };

  return (
    <div 
      className="book-card"
      onClick={handleClick}
    >
      <div className="book-card__content">
        <h3 className="book-card__title">{book.name}</h3>
        <div className="book-card__info">
          <p className="book-card__author">Author: {book.author}</p>
          <p className="book-card__publisher">Publisher: {book.publisher}</p>
          <p className="book-card__quantity">Available: {book.quantity_in_library}</p>
        </div>
      </div>
    </div>
  );
};

export default BookCard;