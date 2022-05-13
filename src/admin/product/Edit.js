import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import '~/admin/style/index.css';
import { isFailing, isLoading, isSuccess } from '~/redux/slice/auth';
import {useDropzone} from 'react-dropzone';
import CheckForm from './checkForm';

const EditProduct = ({cache}) => {

    const [image,setImage] = useState('');
    const [kindBox,setKindBox] = useState([]);
    const imgRef = useRef("");
    
    const onDrop = useCallback(acceptedFiles => {
        if(image){
            URL.revokeObjectURL(image);
        }
        imgRef.current = acceptedFiles[0];
        const url = URL.createObjectURL(acceptedFiles[0]);
        setImage(url);
      }, []);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
    const vietRef = useRef();
    const anhRef = useRef();
    const descriptionRef = useRef();
    const trailerRef = useRef();
    const movieRef = useRef();
    const statusRef = useRef();
    const countryRef = useRef();
    const bornRef = useRef();
    const timeRef = useRef();
    const categaryRef = useRef();

    const auth = useSelector(state => state.auth);
    const  [kind,setKind] = useState([]);
    const [movie,setMovie] = useState('');
    const {slug} = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        let here = true;
        dispatch(isLoading());
        const url = `/product/one/${slug}`;
        if(cache.current[url]){
            return setMovie(cache.current[url]);
        }
        axios.get(url)
            .then(res => {
                if(!here){
                    dispatch(isSuccess());
                    return;
                }
                dispatch(isSuccess());
                setMovie(res.data.product);
                cache.current[url] = res.data.product;
            })
            .catch(() => {
                dispatch(isFailing());
            })
    },[]);
    useEffect(() => {
        let here = true;
        dispatch(isLoading());
        axios.get('/kind')
            .then(res => {
                if(!here){
                    return;
                }
                dispatch(isSuccess());
                setKind(res.data.kinds);
            })
            .catch(err => {
                dispatch(isFailing());
            }) 
        return () => {
            here = false;
        }
    },[]);


    const handleEdit = () => {

    }

  return (
    <div className='admin-create'>
        <div className='grid wide'>
            <div className='admin-create-container'>
                <div className='admin-create-form'>
                    <div className='admin-create-img-again'>
                        <img src={image || movie?.image} />
                        <div className='admin-create-img-form'>
                            <div style={{width:'100%',height:'100%',display:"flex",alignItems:"center",justifyContent:"center"}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                <span>
                                    <i style={{marginRight:"1rem"}} className="fa-solid fa-image"></i>
                                    Ảnh
                                </span> :
                                <span>
                                    <i style={{marginRight:"1rem"}} className="fa-solid fa-image"></i>
                                    Ảnh
                                </span>
                            }
                            </div>
                        </div>
                    </div>
                    <div className='admin-create-detail'>
                        <div className='create-title'>
                            <span style={{textTransform:"capitalize"}}>Sửa {movie?.viet}</span>
                        </div>
                        <div className='create-form'>
                            <label>Việt:</label>
                            <input defaultValue={movie?.viet} ref={vietRef} type='text' placeholder='Tên Tiếng Việt'/>
                        </div>
                        <div className='create-form'>
                            <label>Anh:</label>
                            <input defaultValue={movie?.anh} ref={anhRef} type='text' placeholder='Tên Tiếng Anh'/>
                        </div>
                        <div className='create-form'>
                            <label>Trailer:</label>
                            <input defaultValue={movie?.trailer} ref={trailerRef} type='text' placeholder='Trailer'/>
                        </div>
                        <div className='create-form'>
                            <label>Movie:</label>
                            <input defaultValue={movie?.movie} ref={movieRef} type='text' placeholder='Movie'/>
                        </div>
                        <div className='create-form'>
                            <label>Time:</label>
                            <input defaultValue={movie?.times} ref={timeRef} type='text' placeholder='Thời Gian'/>
                        </div>
                        <div className='create-form'>
                            <label>Status:</label>
                            <input defaultValue={movie?.status} ref={statusRef} type='text' placeholder='Status'/>
                        </div>
                        <div className='create-form'>
                            <textarea defaultValue={movie?.description} ref={descriptionRef} placeholder='Description' />
                        </div>
                        <div className='create-form'>
                            <label>Country:</label>
                            <input defaultValue={movie?.country} ref={countryRef} type='text' placeholder='Country'/>
                        </div>
                        <div className='create-form'>
                            <label>Born:</label>
                            <input defaultValue={movie?.born} ref={bornRef} type='text' placeholder='Born'/>
                        </div>
                        <div className='create-form'>
                            <select ref={categaryRef}>
                                <option selected={movie?.categary == 'phim-le' ? 'selected' : ''} value='phim-le'>Phim Lẻ</option>
                                <option selected={movie?.categary == 'phim-bo' ? 'selected' : ''} value='phim-bo'>Phim Bộ</option>
                                <option selected={movie?.categary == 'phim-chieu-rap' ? 'selected' : ''} value='phim-chieu-rap'>Phim Chiếu Rạp</option>
                                <option selected={movie?.categary == 'anime' ? 'selected' : ''} value='anime'>Anime</option>
                            </select>
                        </div>
                        {movie?.categary === 'phim-bo' &&
                        <div className='create-phim-bo'>
                            <span>Thêm tập: </span>
                            <input placeholder='Tập' className='create-number' type='number' />
                            <input className='create-link' type='text' placeholder='Link'/>
                        </div>
                        }
                        <div className='check_form-container'>
                            {kind.map(item => 
                                <CheckForm totalKind={movie?.kind} setKindBox={setKindBox} kindBox={kindBox} item={item} key={item?.name + "checkbox"} /> 
                            )}
                        </div>
                        <div className='create-button'>
                            <button onClick={handleEdit}>Sửa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditProduct