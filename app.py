from flask import Flask, request, render_template
import gensim
import re

app = Flask(__name__)

model = gensim.models.KeyedVectors.load_word2vec_format(
    "./wiki.vec_nva_150_100_10_1.pt",
    binary=True,
)


@app.route("/backend", methods=["POST"])
def backend():
    try:
        text = request.form.get("text")
        text_p = re.sub("[＋]", ",+", text)
        text_m = re.sub("[－-]", ",-", text_p)
        word_list = text_m.split(",")
        pos = [re.sub("\+(.*)", r"\1", x) for x in word_list if re.match("[^-]+", x)]
        neg = [re.sub("-(.*)", r"\1", x) for x in word_list if re.match("-.*", x)]
        similar = model.most_similar(positive=pos, negative=neg)
        similar_words = [str(x[0]) for x in similar]
        result = (
            text + "<span class='inline-block'>＝<strong class='text-primary'>" + similar_words[0] + "</strong></span>"
        )
        candidate = "<li>" + "</li><li>".join(similar_words) + "</li>"
        return {"result": result, "candidate": candidate}
    except:
        return {
            "error": "<div class='error p-3'><u>エラー</u><br>以下の項目を確認してみてください。<br><br><ul><li>一般的な単語ですか。</li><li>名詞、動詞、形容詞のいずれかですか。</li><li>動詞と形容詞は基本形ですか。</li><li>マイナス記号が長音符になっていませんか。</li></ul></div>"
        }


@app.route("/")
def front():
    return render_template("index.html")


if __name__ == "__main__":
    app.run()
