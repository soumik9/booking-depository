import { useParams, useNavigate } from 'react-router-dom';
import { useDeleteBookMutation, useGetBookQuery } from '../../redux/features/book/bookApi';
import { Link } from 'react-router-dom';
import { homeUrl } from '../../config/constants';

const BookDetails = () => {

    const { bookId } = useParams();
    const navigate = useNavigate();

    // get books from redux api
    const { data: book, isLoading, isError } = useGetBookQuery(bookId);
    const [deleteBook, { isLoading: deleteLoading }] = useDeleteBookMutation(undefined);

    // deleting
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            await deleteBook(book?.data?._id);
            navigate(homeUrl);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    if (isLoading || deleteLoading) {
        return <div className='f-center'>{isLoading ? 'Loading...' : 'Deleting'}</div>
    }
    if (isError) {
        return <div className='f-center'>Error...</div>
    }

    return (
        <div className='container mt-20'>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 pt-2 pb-4">
                    <h3 className="text-[20px] font-semibold text-gray-800 mb-2 w-[90%] truncate">{book?.data?.title}</h3>
                    <p className="text-sm text-gray-600">By {book?.data?.author}</p>
                    <p className="text-sm text-gray-600 mt-1">Publication Date: {book?.data?.publication_date}</p>
                    <p className="text-sm text-gray-600 mt-1">Genre: {book?.data?.genre}</p>

                    <div className="mt-6 flex gap-4 justify-end">
                        <Link to={`/edit-book/${book?.data?._id}`}>
                            <button className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary-600 trans focus:outline-none">
                                Edit
                            </button>
                        </Link>

                        <button
                            type='button'
                            className="px-4 py-2 text-white bg-error rounded-md hover:bg-error-hover trans focus:outline-none"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookDetails