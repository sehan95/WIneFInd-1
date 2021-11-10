import styles from '../styles/Mall.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Article from '../components/Article';
import FilterList from '../components/FilterList';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Icon } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';

const Mall = ({ toggleModal }) => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(null);
  const [searchText, setSearchText] = useState(null);
  //Article Get Api로 articles에 게시글 목록 넣기
  let types = ['red', 'white', 'rose', 'sparkling'];
  let countries = [
    'France',
    'Italy',
    'Spain',
    'New Zealand',
    'USA',
    'Australia',
    'Chile',
    'Germany',
    'Argentina',
    'Republic of South Africa',
    'Hungary',
  ];
  let taste = ['acidity', 'sweetness', 'body', 'tannic'];

  let filterConditionList = {
    types: [],
    countries: [],
    sweetness: [],
    acidity: [],
    body: [],
    tannic: [],
    price: [],
  };
  const handlePageChange = (page) => {
    setPage(page - 1);
    console.log('asdasdasdasdasdasdasdas', page - 1);
  };

  const getFilteredList = () => {
    let typesList = '';
    let countriesList = '';
    let sweetnessList = '';
    let acidityList = '';
    let bodyList = '';
    let tannicList = '';
    let priceList = '';

    for (let ele of [...new Set(list)]) {
      if (types.includes(ele)) {
        typesList += `${ele},`;
      } else if (countries.includes(ele)) {
        countriesList += `${ele},`;
      } else if (ele.slice(0, 5) === 'sweet') {
        sweetnessList += `${ele},`;
      } else if (ele.slice(0, 7) === 'acidity') {
        acidityList += `${ele},`;
      } else if (ele.slice(0, 4) === 'body') {
        bodyList += `${ele},`;
      } else if (ele.slice(0, 6) === 'tannic') {
        tannicList += `${ele},`;
      }
    }

    function eraseComma(ele) {
      if (ele[ele.length - 1] === ',') {
        return ele.slice(0, ele.length - 1);
      }
      return ele;
    }
    typesList = eraseComma(typesList);
    countriesList = eraseComma(countriesList);
    sweetnessList = eraseComma(sweetnessList);
    acidityList = eraseComma(acidityList);
    bodyList = eraseComma(bodyList);
    tannicList = eraseComma(tannicList);

    let url = `${process.env.NEXT_PUBLIC_API_URL}/article/filter?typesList=${typesList}&countriesList=${countriesList}&sweetnessList=${sweetnessList}&acidityList=${acidityList}&bodyList=${bodyList}&tannicList=${tannicList}&priceList=`;
    console.log('url=====================================', url);
    axios
      .get(url, { withCredentials: true })
      .then((res) => {
        console.log('SUCCESS, NOW GET NEW DATA!!!');
        console.log('???:', res);
        setArticles(res.data.content);
      })
      .catch((e) => {
        console.log('error!:', e);
      });
  };

  const getArticlesPage = () => {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/article?page=${page}`;
    if (searchText !== null) {
      url += `&text=${searchText}`;
    }
    axios
      .get(url, {
        withCredentials: true,
      })
      .then((res) => {
        setTotalArticles(res.data.articlesInfo.totalElements);
        // console.log('this page data:', res.data.articlesInfo.content);
        setArticles(res.data.articlesInfo.content);
      })
      .catch((e) => {
        console.log('error!:', e);
      });
    window.scrollTo(0, 0);
  };

  const handleSearchText = (e) => {
    setSearchText(e.target.value);
  };

  const [list, setList] = useState([]);

  const addToFilterCondition = (e) => {
    let ele = e.target.innerText;
    if (types.includes(ele)) {
      if (!filterConditionList.types.includes(ele)) {
        filterConditionList.types.push(ele);
      }
    }
    if (countries.includes(ele)) {
      if (!filterConditionList.countries.includes(ele)) {
        filterConditionList.countries.push(ele);
      }
    }
    setList(list.concat(Object.values(filterConditionList)).flat());
  };

  const handleInputValue = (e) => {
    let keyType = e.target.name;
    if (keyType === 'sweetness') {
      filterConditionList[keyType][0] = 'sweetness' + e.target.value;
    } else if (keyType === 'acidity') {
      filterConditionList[keyType][0] = 'acidity' + e.target.value;
    } else if (keyType === 'body') {
      filterConditionList[keyType][0] = 'body' + e.target.value;
    } else if (keyType === 'tannic') {
      filterConditionList[keyType][0] = 'tannic' + e.target.value;
    } else {
      filterConditionList[keyType][0] = e.target.value;
    }
  };

  const eraseAll = () => {
    setList([]);
  };
  const eraseThis = (e) => {
    let erase_target = e.target.innerText;
    let erase_icon = e.target.outerHTML.split('"')[1];
    let new_list = list.filter((item) => item !== erase_target);
    new_list = list.filter((item) => item !== erase_icon);
    setList(new_list);
  };

  const goToUpload = () => {
    let token = localStorage.getItem('winefind');
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth?token=${token}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log('logined');
        router.push('/upload');
      })
      .catch((e) => {
        console.log('not Logined');
        toggleModal();
      });
  };

  useEffect(() => {
    getArticlesPage();
  }, [page]);

  return (
    <div className={classNames('text_font', styles.mall_container)}>
      <div className={styles.main_box}>
        <div className={styles.searchAndWineList_box}>
          <div className={styles.top_banner}>
            <img
              style={{ width: '57rem', height: '170px' }}
              src='images/winebanner2.gif'
            />
          </div>
          <div className={styles.mall_top}>
            <input
              className={styles.search_bar}
              placeholder='Find Your Wine!'
              type='search'
              onChange={handleSearchText}
            />
            <img
              style={{
                width: '20px',
                height: '20px',
                position: 'relative',
                right: '50px',
              }}
              onClick={getArticlesPage}
              src='images/search.png'
            />
            <div>
              <Button
                style={{
                  backgroundColor: 'white',
                  border: '#cda581 solid 1px',
                  height: '41px',
                }}
                onClick={goToUpload}
                animated
              >
                <Button.Content style={{ width: '4.6rem' }} visible>
                  게시글 작성
                </Button.Content>
                <Button.Content hidden>Upload</Button.Content>
              </Button>
              {/* <button onClick={test}>testButton</button> */}
            </div>
          </div>
          <div className={styles.mall_content_box}>
            <div className={styles.text_and_sort}>
              <div className={styles.text_big}>
                {console.log('=========', articles)}
                전체 와인({totalArticles})
              </div>
              <form>
                <select
                  style={{
                    padding: '0.4rem',
                    border: '1px solid #cda581',
                    borderRadius: '3px',
                  }}
                >
                  {/* onchange로 api 호출 */}
                  <option value='최신등록순'>최신등록순</option>
                  <option value='가격낮은순'>가격낮은순</option>
                  <option value='가격높은순'>가격높은순</option>
                  <option value='평점순'>평점순</option>
                </select>
              </form>
            </div>
            {articles.length !== 0 ? (
              <Article articles={articles} />
            ) : (
              <div>Loading Something</div>
            )}
            <div className={styles.page}>
              <Pagination
                activePage={page + 1}
                itemsCountPerPage={5}
                totalItemsCount={totalArticles}
                pageRangeDisplayed={5}
                prevPageText={'‹'}
                nextPageText={'›'}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        <div className={styles.filter_box}>
          <div className={styles.filter_top_content}>
            <div className={styles.filter_top}>
              <div className={styles.filter_title}>필터</div>
              <div>
                {/* <button onClick={getFilteredList}>필터 적용</button> */}
              </div>
              <div
                className={styles.redo_box}
                style={{ marginLeft: '100px' }}
                onClick={getFilteredList}
              >
                <Icon name='filter' />
                <input className={styles.redo} type='reset' value='필터 적용' />
              </div>
              <div className={styles.redo_box} onClick={eraseAll}>
                <Icon name='redo' />
                <input className={styles.redo} type='reset' value='초기화' />
              </div>
            </div>
            <div className={styles.filter_container}>
              {console.log('this is filter list,', [...new Set(list)])}
              {list !== undefined
                ? [...new Set(list)].map((ele, index) => (
                    <FilterList ele={ele} key={index} eraseThis={eraseThis} />
                  ))
                : null}
            </div>
          </div>
          <div className={styles.filter_content}>
            <div className={styles.filter_top}>
              <div className={styles.filter_title}>종류</div>
            </div>
            <div className={styles.filter_type}>
              {types.map((type, index) => (
                <button
                  key={index}
                  className={styles.filter_button}
                  // onClick={addToFilterCondition}
                  onClick={addToFilterCondition}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filter_content}>
            <div className={styles.filter_top}>
              <div className={styles.filter_title}>국가</div>
            </div>
            <div className={styles.filter_type}>
              {countries.map((country, index) => (
                <button
                  key={index}
                  className={styles.filter_button}
                  onClick={addToFilterCondition}
                >
                  {country}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filter_content}>
            <div className={styles.filter_top}>
              <div className={styles.filter_title}>맛</div>
            </div>
            <div className={styles.filter_type}>
              {taste.map((ele, index) => (
                <div key={index} className={styles.filter_taste}>
                  <div>
                    {ele.slice(0, 1).toUpperCase().concat(ele.slice(1))}
                  </div>
                  <br />
                  <input
                    className={styles.taste_input}
                    type='range'
                    min='0'
                    max='4'
                    step='1'
                    name={ele}
                    onClick={addToFilterCondition}
                    onInput={handleInputValue}
                  />
                  <div className={styles.seperator}>
                    <div>0</div>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.filter_content}>
            <div className={styles.filter_top}>
              <div className={styles.filter_title}>가격(₩)</div>
            </div>
            <div className={styles.filter_price}>
              <div style={{ display: 'flex' }}>
                <input
                  className={styles.price_box}
                  type='number'
                  step='10000'
                  min='10000'
                  defaultValue='10000'
                />
                <div style={{ width: '30px' }}>이상</div>
              </div>
              <br />
              <div style={{ display: 'flex' }}>
                <input
                  className={styles.price_box}
                  type='number'
                  step='10000'
                  min='10000'
                  defaultValue='10000'
                />
                <div style={{ width: '30px' }}>이하</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mall;
