from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, PorterStemmer



text = """I’ve been asked by a few friends to develop a feature for a
WhatsApp chatbot of mine, that summarizes articles based on
URL inputs. So when a friend sends an article to a WhatsApp
group, the bot will reply with a summary of the given URL
article. I like this feature because from my personal
research, 65% of group users don’t even click the shared URLs,
but 97% of them will read a few lines of the articles summary.
As part of being a Fullstack developer, it is important to
know how to choose the right stack for each product you
develop, depending on the requirements and limitations.
For web crawling, I love using Python. The Python community
is filled with efficient, easy to implement open source
libraries both for web crawling and text summarization.
Once you’re done with this tutorial, you won’t believe how
simple it is to implement the task."""

words = word_tokenize(text)
# words = text.split(" ")
sentences = sent_tokenize(text)
sw = stopwords.words('english')
w_net = WordNetLemmatizer()
ps = PorterStemmer()

freq_table = dict()
for word in words:
    word = word.lower()

    if word in sw:
        continue

    #     word = w_net.lemmatize(word, pos='v')
    word = ps.stem(word)
    if word in freq_table:
        freq_table[word] += 1
    else:
        freq_table[word] = 1

sent_table = dict()

for sentence in sentences:
    for word, freq in freq_table.items():
        if word in sentence:
            if sentence in sent_table:
                sent_table[sentence] += freq
                print("Word =>",word)
                print("Sentence =>",sentence)
                print(sent_table)
            else:
                sent_table[sentence] = freq
                print("Word =>",word)
                print("Sentence =>",sentence)
                print(sent_table)



print(sent_table)

sum_val = 0

for s in sent_table.values():
    sum_val += s

avg = int(sum_val/len(sent_table))

summary = ""

for sentence in sentences:
    if sent_table[sentence] > avg * 1.2 and sentence in sent_table:
        summary += sentence

print(summary)