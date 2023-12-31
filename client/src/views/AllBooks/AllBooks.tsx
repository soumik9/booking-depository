import { useGetBooksQuery } from '../../redux/features/book/bookApi';
import { IBook, IGenre, IYear } from '../../config/types';
import BookCard from '../../components/BookCard/BookCard';
import { useEffect, useState } from 'react';
import { genres, years } from '../../config/constants';
import FilterCheckbox from './components/FilterCheckbox';
import BodyHead from '../Home/components/BodyHead';

const AllBooks = () => {
    // states
    const [searchValue, setSearchValue] = useState<string>('');
    const [datas, setDatas] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedYears, setSelectedYears] = useState<string[]>([]);

    // get roles from redux api
    const { data: books, isLoading, isError } = useGetBooksQuery({ limit: undefined, search: searchValue, isLatest: false });

    // filtering data by publication year and genre
    useEffect(() => {
        if (selectedGenres.length || selectedYears.length) {
            const filteredBooks = books?.data?.filter((item: IBook) => {
                const publicationYear = new Date(item.publication_date).getFullYear().toString();
                return (
                    (selectedGenres.length === 0 || selectedGenres.includes(item.genre)) &&
                    (selectedYears.length === 0 || selectedYears.includes(publicationYear))
                );
            }) || [];
            setDatas(filteredBooks);
        } else {
            setDatas(books?.data)
        }
    }, [selectedGenres, books?.data, selectedYears]);

    // handle checkbox
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const genre = e.target.value;
        if (e.target.checked) {
            setSelectedGenres((prevSelectedGenres) => [...prevSelectedGenres, genre]);
        } else {
            setSelectedGenres((prevSelectedGenres) => prevSelectedGenres.filter((g) => g !== genre));
        }
    };

    const handleCheckboxYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        const genre = e.target.value;
        if (e.target.checked) {
            setSelectedYears((prevSelectedGenres) => [...prevSelectedGenres, genre]);
        } else {
            setSelectedYears((prevSelectedGenres) => prevSelectedGenres.filter((g) => g !== genre));
        }
    };

    if (isError) {
        return <>Error</>;
    }

    return (
        <div className='container'>

            <BodyHead
                totalLength={books?.data?.length}
                showingLength={books?.meta?.total ? books?.meta?.total : 0}
                title='All Books Showcase'
            />

            {isLoading ? <div className='flex justify-center my-6'>Loading...</div> : (
                <div className='grid lg:grid-cols-4 grid-cols-5 gap-5 mt-2 lg:mt-0'>

                    <div className='mt-5 flex flex-col gap-2 col-span-2 lg:col-span-1'>
                        <p className='mb-1'>Genres</p>
                        <hr className='mb-2' />
                        {genres.map((item: IGenre) => (<div key={item._id}>
                            <FilterCheckbox
                                value={item.genre}
                                checked={selectedGenres.includes(item.genre)}
                                onChange={handleCheckboxChange}
                                selectedItems={selectedGenres}
                            />
                        </div>
                        ))}

                        <p className='mt-4'>Year</p>
                        <hr className='mb-2' />
                        {years.map((item: IYear) => (<div key={item._id}>
                            <FilterCheckbox
                                value={item.year}
                                checked={selectedYears.includes(item.year)}
                                onChange={handleCheckboxYear}
                                selectedItems={selectedGenres}
                            />
                        </div>
                        ))}
                    </div>

                    <div className='col-span-3'>
                        <input
                            type="text"
                            id="search"
                            className="w-full px-4 py-2 my-4 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary text-right"
                            placeholder='search book by author || genre || title'
                            onChange={(e) => setSearchValue(e.target.value)}
                        />

                        <div className='grid md:grid-cols-2 xll:grid-cols-3 gap-x-[20px] gap-y-[30px] mt-6 pb-10'>
                            {datas?.map((item: IBook) => <BookCard key={item._id} item={item} />)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllBooks;
