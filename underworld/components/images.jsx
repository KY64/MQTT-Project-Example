export default props =>
    <img src={props.source} width={props.w} height={props.h}
         style={{
                borderRadius:"999px",
                overflow:'hidden',
                objectFit: 'contain',
                background: '#ccc',
                }}
    />