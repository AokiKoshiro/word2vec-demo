import gensim
model_nva_200_30_10_20 = gensim.models.KeyedVectors.load_word2vec_format('./wiki.vec_nva_150_100_10_1.pt', binary=True)
print(model_nva_200_30_10_20.most_similar(positive = ['会長']))
print(model_nva_200_30_10_20.similarity('実家', '流れ弾'))
