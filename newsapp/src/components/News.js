import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {
 const [article, setarticle] = useState([])
 const [loading, setloading] = useState(true)
 const [page, setpage] = useState(1)
 const [totalResults, settotalResults] = useState(0)


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase()+ string.slice(1);
}

  
  const updateNews=async()=>
  {
   props.setprogress(20);
    const url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setloading(true)
    let data= await fetch(url);
   props.setprogress(40);
    let parsedData= await data.json();
   props.setprogress(60);
   setarticle(parsedData.articles)
   settotalResults(parsedData.totalResults)
   setloading(false)
   props.setprogress(100);
  }

  useEffect(() => {
    document.title= `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews()
  }, [])
  

  const fetchMoreData = async () => {
    let url=`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setpage(page+1)
    let data= await fetch(url);
    let parsedData= await data.json();
    setarticle(article.concat(parsedData.articles))
    settotalResults(parsedData.totalResults)
  };

    return (
      <>
        <h1 className="text-center" style={{margin:'35px 0px', marginTop:'20px'}} >NewsArc - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={article.length}
          next={fetchMoreData}
          hasMore={article.length !== totalResults}
          loader={<Spinner/>}
        >
          <div className="container">
        <div className="row">
           {article.map((element)=>{
              return <div className="col-md-4" key={element.url} >
                <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
        </div>     
        })}    
        </div>
        </div>
        </InfiniteScroll>
        </>
    )
}

News.defaultProps = {
  country:'in',
  pageSize:6,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News
