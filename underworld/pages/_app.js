require('typeface-open-sans')
export default function MyApp({ Component, pageProps }) {
    return (
    <>
    <Component {...pageProps} />
    <style global jsx>{`
        body {
            margin: 0;
            color: #333;
            font-family: 'Open Sans', sans-serif;
        }
    `}</style>    
    </>
    )
}