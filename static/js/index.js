var $comment = $("#comment");

function addSign(sign){
    var input_text = $comment.val();
    var slc_stt = $comment.get(0).selectionStart;
    $comment.val(input_text.substr(0, slc_stt) + sign + input_text.substr(slc_stt));
    $comment.focus();
    $comment.get(0).setSelectionRange(slc_stt + 1, slc_stt + 1);
}
    
$("#plus").on("click", () => {
    addSign("＋");
});
    
$("#minus").on("click", () => {
    addSign("－");
});
    
$("#clear").on("click", () => {
    $comment.val("");
    $comment.focus();
});
    
$comment.keypress((e) => {
    if(e.which == 13){
        $("#calc-btn").click();
        return false;
    }
});

var $candidateButton = $("#candidateButton");
$candidateButton.on("click", () => {
    if ($candidateButton.attr("aria-expanded") == "true") {
        $candidateButton.text("候補");
    } else {
        $candidateButton.text("候補を表示する");
    }
});

$("#calc-btn").on("click", () => {
    $("#calc").hide();
    $("#loading").show();
    
    var input_txt = $comment.val();
        input_txt = input_txt.replace(/\+/g, '＋');
        input_txt = input_txt.replace(/\s/g, "");
    var URL = "./backend";
    var dataString = "text=" + input_txt;
    
    $.ajax({
        type: "POST",
        url: URL,
        data: dataString
    })
    .done((resp) => {
        if (resp.error) {
            $(".error-outer").get(0).style.display = "";
            $(".success-outer").get(0).style.display = "none";
            $(".error-outer").html(resp.error);
        } else {
            $(".error-outer").get(0).style.display = "none";
            $(".success-outer").get(0).style.display = "";
            $("#result").html(resp.result);
            $("#candidate").html(resp.candidate);            
        }

    })
    .fail(() => {
        $(".output-outer").html("<div class='error p-3'><u>通信エラー</u><br>しばらく時間を開けてもう一度実行してみてください。</div>");
    })
    .always(() => {
        $(".output-outer").slideDown(250);
        $("#calc").show();
        $("#loading").hide();
    })
});