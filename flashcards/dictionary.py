from itertools import islice
from typing import Iterable, Dict, List, Optional
from enum import Enum
from nltk.corpus import wordnet
from pygtrie import CharTrie

CACHE = CharTrie()

for word in wordnet.words():
    fixed_word = word.replace("_", " ")
    CACHE[fixed_word] = True


def autocomplete(prefix: str) -> Iterable[str]:
    """Returns an iterator over words that match a given prefix"""
    # TODO: sort words by popularity?
    words = CACHE.iterkeys(prefix=prefix)
    try:
        return list(islice(words, 10))
    except KeyError:
        return []


def lookup(phrase: str) -> List[Dict]:
    """Returns meanings for a given phrase"""
    phrase = phrase.replace(' ', '_')
    synsets = wordnet.synsets(phrase)
    meanings = [
        {
            'definition': synset.definition(),
            'examples': synset.examples(),
            'word_class': WordClass.from_wordnet_str(synset.pos()),
            'id': synset.name(),
        }
        for synset in synsets
    ]
    return meanings


def lookup_meaning(phrase: str, meaning_id: str) -> Optional[Dict]:
    """Returns a specific meaning for a phrase"""
    meanings = lookup(phrase)
    for meaning in meanings:
        if meaning['id'] == meaning_id:
            return meaning

    return None


class WordClass(Enum):
    NOUN = 1
    VERB = 2
    ADJECTIVE = 3
    ADVERB = 4
    ADJECTIVE_SATELLITE = 5

    @classmethod
    def from_wordnet_str(cls, word_class):
        if word_class == wordnet.NOUN:
            return cls.NOUN
        if word_class == wordnet.VERB:
            return cls.VERB
        if word_class == wordnet.ADJ:
            return cls.ADJECTIVE
        if word_class == wordnet.ADV:
            return cls.ADVERB
        if word_class == wordnet.ADJ_SAT:
            return cls.ADJECTIVE_SATELLITE

        raise ValueError(word_class)
