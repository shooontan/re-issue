var NaviArea = React.createClass({
    render: function() {
        return (
            <div className="navi-inner">
            <NaviUserArea />
            </div>
        )
    }
});


var NaviUserArea = React.createClass({
    render:function() {
        return (
            <div></div>
        )
    }
});










var CommentBox = React.createClass({
    render: function() {
        return (
            <div className="commentBox">
            Hello, world! I am a CommentBox.
            </div>
        );
    }
});

const content = document.getElementById("content");
const navi = document.getElementById("navi2");

//レンダリング
ReactDOM.render(
    <CommentBox />,
    content
);

ReactDOM.render(
    <NaviArea/>,
    navi
);