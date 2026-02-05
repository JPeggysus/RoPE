import React, { useState } from 'react';
import Layout from './components/Layout';
import Section from './components/Section';
import TokenizationDemo from './components/TokenizationDemo';
import AttentionMechanism from './components/AttentionMechanism';
import MultiHeadOverview from './components/MultiHeadOverview';
import DotProductDemo from './components/DotProductDemo';
import WeightedSumDemo from './components/WeightedSumDemo';
import PositionalProblemDemo from './components/PositionalProblemDemo';
import BagOfWordsDemo from './components/BagOfWordsDemo';
import AbsolutePositionalDemo from './components/AbsolutePositionalDemo';
import RopeIntroDemo from './components/RopeIntroDemo';
import RopeSlicingDemo from './components/RopeSlicingDemo';
import VectorArrowVis from './components/VectorArrowVis';
import FrequencyDemo from './components/FrequencyDemo';
import RopeRotationDemo from './components/RopeRotationDemo';
import RopeApplicationDemo from './components/RopeApplicationDemo';
import RopeOutcomeDemo from './components/RopeOutcomeDemo';
import MathIntroSection from './components/MathIntroSection';
import RotationDerivationDemo from './components/RotationDerivationDemo';
import RopeMatrixStructureDemo from './components/RopeMatrixStructureDemo';
import RopeDotProductIntro from './components/RopeDotProductIntro';
import RopeEquationDerivation from './components/RopeEquationDerivation';
import TransposePropertyDemo from './components/TransposePropertyDemo';
import AssociativityDemo from './components/AssociativityDemo';
import RopeMultiplicationDemo from './components/RopeMultiplicationDemo';
import TrigIdentityVisualizer from './components/TrigIdentityVisualizer';
import RopeMatrixSimplificationDemo from './components/RopeMatrixSimplificationDemo';
import { TWINKLE_VECTOR, LITTLE_VECTOR } from './constants';
import { TokenData } from './types';

const tokens: TokenData[] = [
  { id: 0, text: 'Twinkle', vector: TWINKLE_VECTOR, position: 0 },
  { id: 1, text: 'Twinkle', vector: TWINKLE_VECTOR, position: 1 }, // Same vector as pos 0
  { id: 2, text: 'Little', vector: LITTLE_VECTOR, position: 2 },
];

const MathSpan: React.FC<{children: React.ReactNode}> = ({children}) => {
  if (typeof children !== 'string') {
    return (
      <span className="font-mono text-sm bg-paper-dark px-1 rounded mx-1 inline-block border border-grid/30 text-ink">
        {children}
      </span>
    );
  }

  // Parse latex-like syntax for subscripts and superscripts
  // Supports _{text}, ^{text}, _c, ^c
  const regex = /(_\{[^}]+\}|\^\{[^}]+\}|_[a-zA-Z0-9]|\^[a-zA-Z0-9])/g;
  const parts = children.split(regex);

  return (
    <span className="font-mono text-sm bg-paper-dark px-1 rounded mx-1 inline-block border border-grid/30 text-ink align-middle">
      {parts.map((part, i) => {
        if (!part) return null;
        
        if (part.startsWith('_{') && part.endsWith('}')) {
          return <sub key={i} className="text-[0.75em] align-baseline relative -bottom-[0.2em]">{part.slice(2, -1)}</sub>;
        }
        if (part.startsWith('^{') && part.endsWith('}')) {
          return <sup key={i} className="text-[0.75em] align-baseline relative -top-[0.3em]">{part.slice(2, -1)}</sup>;
        }
        if (part.startsWith('_')) {
           return <sub key={i} className="text-[0.75em] align-baseline relative -bottom-[0.2em]">{part.slice(1)}</sub>;
        }
        if (part.startsWith('^')) {
           return <sup key={i} className="text-[0.75em] align-baseline relative -top-[0.3em]">{part.slice(1)}</sup>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

const App: React.FC = () => {
  const [baseFrequency, setBaseFrequency] = useState(10000);

  return (
    <Layout 
      title="Unraveling RoPE: How LLMs See Position" 
    >
      {/* Introduction Section */}
      <div className="prose prose-lg prose-p:text-ink prose-headings:font-serif max-w-none mb-0 text-center md:text-left">
        <p>
          My LLM obsession has cemented itself into an insatiable quest to understand every component of these systems. To those with
          the same motivations, this is for you. I designed this to be approachable to anyone, regardless of prior knowledge. If you are just starting your AI journey,
          I hope this provides you with a foundation to build upon. For those further along, I hope this grounds your knowledge and clarifies any confusion. 
          While learning about the transformer architecture, I found it odd that something designed to understand and produce sequential data is non-sequential by nature.
          Language is sequential. Music is sequential. Video is sequential. But the architecture that has mastered these domains does not have any innate ability to understand sequence. 
          Transformers break inputs into pieces that are processed simultaneously. There is an art to ensuring that these pieces represent both meaning and order. 
          We will explore how this art has evolved into the current method of injecting position into LLMs: Rotary Positional Embeddings (RoPE).
        </p>
      </div>

      {/* PART 1 DIVIDER */}
      <div className="py-24 flex items-center justify-center">
        <div className="w-full h-px bg-ink opacity-20"></div>
        <h2 className="shrink-0 px-8 text-3xl font-serif text-ink italic">Part I: The Problem of Position</h2>
        <div className="w-full h-px bg-ink opacity-20"></div>
      </div>

      <Section 
        number="1" 
        title="Embeddings"
        marginNote="Input tokens are represented as numbers that do not consider sequential order."
      >
        <p>
          For an LLM to process language, we have to represent words as numbers. 
          Consider the phrase: "Twinkle, Twinkle, Little". How do we represent it in a way that'll let an algorithm produce "Star"?
        </p>
        <br></br>
        <p>
          Each word is tokenized and mapped to a representation known as an <span className="font-bold text-rust">Embedding</span>. 
          An embedding is a set of numbers stored in a high-dimensional vector (here, reduced to <MathSpan>d=16</MathSpan> for clarity) where geometric proximity correlates with semantic similarity. Basically, an embedding is the essence of a word captured by a set of numbers that, in this case, correspond with a point in a 16-dimension space.
          These representations are learned during training and are <span className="italic">context-independent</span>. Notice below that the first "Twinkle" has the same numerical 
          representation as the second "Twinkle". Our input at this stage does not consider order.
        </p>
      </Section>

      <TokenizationDemo tokens={tokens} />

      <Section 
        number="2" 
        title="Self-Attention"
        marginNote="All input tokens flow into each head, each produces a suggestion for how to update tokens, these are combined to make updates that more accurately reflect a token's actual meaning."
      >
        <p>
          A raw embedding represents a token in isolation (e.g., "Orange" could be a color <em>or</em> a fruit). 
          To determine the specific meaning in <em>this</em> sentence, the token representation must consider its neighbors.
          A <strong>Self-Attention Layer</strong> acts like a council with the goal of transforming our embeddings into more nuanced representations that consider the contents of the entire sequence. It is composed of multiple independent "Heads". Think of each Head as a council member with a specific expertise.
        </p>
        <br></br>
        <p>
          Every token embedding passes through these heads simultaneously. Each suggests how the embeddings should be updated to more accurately encode token meanings in this particular context. 
          These suggestions are combined to create final updates to the original embeddings, yielding a richer, context-aware representation of our input. The model then further-refines these contextualized embeddings individually via a <strong>Feed-Forward Network</strong> based on what it learned during training. The resulting embeddings are then passed to the next self-attention layer where this entire process happens again. This is done over and over, until our representation of the input is polished enough to make a prediction for what should come next in the sequence.</p>
      </Section> 

      <MultiHeadOverview tokens={tokens} />

      <Section 
        number="3" 
        title="Inside the Head"
        marginNote="Head 0 splits the 16d input into three 8d vectors: Query, Key, and Value."
      >
        <p>
          Let's zoom into a single head: <strong>Head 0</strong>. How does it generate its "suggestions"?
        </p>
        <br></br>
        <p>
          Inside the head, each input embedding <MathSpan>x_i</MathSpan> is projected into three distinct lower-dimensional vectors (here <MathSpan>d=8</MathSpan>) using learned matrices:
          <MathSpan>W_Q</MathSpan>, <MathSpan>W_K</MathSpan>, and <MathSpan>W_V</MathSpan>.
          Two of these vectors (the Query and Key) represent what the embedding would find useful 
          and what it has to offer. The Queries and Keys for all the input embeddings are compared. If an embedding is offering something that another needs (its Key is similar to another's Query), 
          then its third vector (the Value vector) is passed along and used to update the embedding.
        </p>
        <br></br>
        <p>
          It helps me to think of these interactions as a marketplace:
        </p>
         <br></br>
        <ul className="list-disc pl-6 space-y-2 mb-4 marker:text-rust">
            <li>The <strong>Query (<MathSpan>q</MathSpan>)</strong>: The "Consumer Need". What is this token looking for? (e.g., "I am an adjective looking for a noun").</li>
            <li>The <strong>Key (<MathSpan>k</MathSpan>)</strong>: The "Advertisement". What info does this token claim to have? (e.g., "I am a noun").</li>
            <li>The <strong>Value (<MathSpan>v</MathSpan>)</strong>: The "Product". If a Query matches the Key, this is the information that gets passed along.</li>
        </ul>
      </Section>

      <AttentionMechanism tokens={tokens} />

      <Section 
        number="4" 
        title="How Do We Determine if a Query and a Key match?"
        marginNote="We calculate similarity between vectors using the dot product. Vectors that point in the same direct have a higher similarity."
      >
        <p>
          Now that we know how Queries, Keys, and Values are generated for each token embedding, how are they actually used? My shopping analogy falls apart a bit at this point because matches are not binary. 
          Before, we acted as if a query either matches a key or does not (just like you either buy a good or do not). 
          In reality, we find to what degree a query and a key are a match and take a proportionate amount of the value vector. 
        </p>
        <br></br>
        <p>
          For each token (the inquirer), we compare its Query vector <MathSpan>q</MathSpan> against the Key vectors <MathSpan>k</MathSpan> of <strong>every token</strong> in the sequence (including itself). The objective is to determine to what degree we should let a specific token influence the inquirer via its Value vector <MathSpan>v</MathSpan>. 
          If a Query strongly matches a Key, we calculate a high "attention score" and mix more of that token's Value vector into our final update of the embedding.
        </p>
        <h3 className="font-bold text-xl mt-8 mb-4">The Dot Product</h3>
        <p>
          The most crucial part of the attention score calculation is determining to what degree a query and key match. To calculate this, we use the <strong>Dot Product</strong>. To understand this intuitively, we need to reframe our understanding of vectors from "a point in high dimension space" to "an arrow pointing to a point in high dimension space". Notably, this allows vectors to have magnitude and direction, which we can compare. 
          When <MathSpan>q</MathSpan> and <MathSpan>k</MathSpan> match, their directions are similar and the angle between them is small. When they don't match, their directions are dissimilar and the angle between them is large. The dot product quantifies the directional alignment between two vectors, representing their similarity as a value scaled by the product of their magnitudes. If they point the exact same way, they are a perfect match. If they point the opposite way, they are not a match at all. This simple operation <MathSpan>q · k</MathSpan> is the backbone of the Transformer.
        </p>
        <br></br>
        <p>
          In our model, the query and key vectors represent arrows in <strong>8-dimensional space</strong>, which is impossible to visualize directly. However, the geometric intuition holds perfectly in 2 dimensions. For the demonstration below, we use 2D vectors as stand-ins for their high-dimensional counterparts. Each vector has a magnitude of 1, so the dot product will fall between -1 and 1. If the vectors had a magnitude of 2, the dot product would fall between -4 and 4. If one had a magnitude of 6 and the other 10, their dot product would fall between -60 and 60.
        </p>

      </Section>

      <DotProductDemo />

      <Section 
        number="5" 
        title="Turning Dot Products Into Updates"
        marginNote="With the softmax function, we convert our similarity scores into percentages. We use these to take weighted sums of the value vectors to calculate the head's suggested updates for each token."
      >
        <p>
            For each embedding, once we have the dot products between its Q and all K's (the raw similarity scores), we convert them into probabilities using a function called <strong>Softmax</strong>. This ensures that all attention weights sum to exactly 100% ("Head 0's suggested update for this token's embedding should be 26% from token 0, 26% from token 1, and 48% from token 2"). We then take the proportionate amount of each embedding's Value vectors and add them together to get the head's suggestion for how to update this particular token embedding.
        </p>
        <br></br>
        <p>
            Essentially, we turn the raw similarity scores from our dot product calculation into a probability distribution for each token. Then, for each distribution, we calculate a weighted sum of all the value vectors. These serve as the head's suggestions for how to update each token embedding. 
        </p>
        <br></br>
        <p>   
            For each token, the suggestions across all heads will then be blended together by another learned weight matrix to create one final 16-dimension "update vector". These update vectors are added to the original token embeddings, which leave us with updated embeddings that capture more of the nuance of what the tokens mean in this particular context.
        </p>
      </Section>
      
      <WeightedSumDemo />

      <Section 
        number="6" 
        title="The Position Problem" 
        marginNote="The math works perfectly, but the logic fails. Without position, the model treats language as a soup of words rather than a sequence."
      >
        <p>
            Now that we know how the <MathSpan>q</MathSpan>, <MathSpan>k</MathSpan>, and <MathSpan>v</MathSpan> vectors are used, we need to take a step back and discuss the fundamental flaw in what we have built so far. Take a look at the actual Query, Key, and Value vectors for our input tokens. Notice specifically the vectors for the two "Twinkle" tokens:
        </p>
        
        <PositionalProblemDemo />

        <p>
            The values for both "Twinkles" are the exact same. This means that to the model, <strong>"Twinkle" in Position 0 is indistinguishable from "Twinkle" in Position 1</strong>.
        </p>
        <br></br>
        <p>
            Their actual meanings are not being fully captured because their position in the sequence is ignored. 
            Consider the sentences <strong>"the light is orange"</strong> and <strong>"the orange is light"</strong>. 
            Both sentences contain the exact same tokens, but they mean completely different things.
        </p>

        <BagOfWordsDemo />

        <p>
            A word's meaning is incredibly dependent on where it is and what is around it. However, because our attention mechanism only looks at vector similarity (<MathSpan>q · k</MathSpan>), and because the vectors are generated from static lookups, the model treats "Twinkle twinkle little", "twinkle little twinkle", and "little twinkle twinkle" as the exact same.
        </p>
        <br></br>
        <p>
            We need a way to inject order into our numbers. We need the vector for "Twinkle" at position 0 to look different than "Twinkle" at position 1. This is the birthplace of <strong>Positional Embeddings</strong>.
        </p>
      </Section>

      <Section
        number="7"
        title="The Additive Era (Absolute Position)"
        marginNote="The simplest solution: just learn a vector for 'Position 0' and add it to the word vector. It works, but it's messy."
      >
        <p>
            Since these models cannot see the order of the token embeddings, we need a way to add information about the token position into the embeddings themselves. 
            This was literally the way it was done at one point...
        </p>
        <br></br>
        <p>
            The solution to the position problem was to create a second set of lookup vectors specifically for positions. In addition to training embeddings for every token, embeddings were trained for every position.
            Vector <MathSpan>p_0</MathSpan> representing "Position 0" would be added to the word embedding in position 0 <MathSpan>x_0</MathSpan>. Then <MathSpan>p_1</MathSpan> would be added to <MathSpan>x_1</MathSpan>. This would continue for the entire input sequence.
        </p>
        <br></br>
        <p>
            Mathematically, token embeddings became: <MathSpan>{`x'_i = x_i + p_i`}</MathSpan>.
        </p>
        
        <AbsolutePositionalDemo />

        <p>
            While this solves the symmetry problem ("Twinkle" at Position 0 is now numerically distinct from "Twinkle" at Position 1) it introduces new issues.
            By adding positional information in, we are effectively distorting the original semantic information. The model now has to work extra hard to learn to disentangle the semantic values from the positional values.
        </p><br></br>
        <p>
            Furthermore, absolute embeddings cannot extrapolate. If we train a model with 512 position vectors, it has no idea what to do with the 513th word in a sentence. It has never learned a vector for <MathSpan>{"\p_{513}"}</MathSpan>. This effectively limits the length of the input sequence.
        </p>
        <h3 className="font-bold text-xl mt-8 mb-4">Translation Invariance</h3>
        <p>
            There is a more subtle, yet profound inefficiency that arises with absolute embeddings known as the lack of <strong>Translation Invariance</strong>.
            Consider "Twinkle, Twinkle". The relationship between these two words is defined by their relative distance: they are neighbors.
            If this pattern appears at the start of the text (Positions 0 and 1), an absolute embedding model considers the relationship between <MathSpan>p_0</MathSpan> and <MathSpan>p_1</MathSpan>. 
            However, if the exact same phrase appears later at Positions 100 and 101, the model confronts two completely new position vectors: <MathSpan>{"\p_{100}"}</MathSpan> and <MathSpan>{"\p_{101}"}</MathSpan>.
        </p><br></br>
        <p>
            Because these vectors are learned independently, the model cannot transfer its knowledge. It has to <em>re-learn</em> the concept of "immediate neighbor" for every single pair of positions in the context window. It has to do this for every positional relationship in every position. It cannot simply learn what being 1 apart or 50 apart looks like.
            Absolute embeddings force the model to memorize absolute coordinates when it only needs to understand relative distances.
        </p>
      </Section>

      {/* PART 2 DIVIDER */}
      <div className="py-24 flex items-center justify-center">
        <div className="w-full h-px bg-ink opacity-20"></div>
        <h2 className="shrink-0 px-8 text-3xl font-serif text-ink italic">Part II: The Rotation Solution</h2>
        <div className="w-full h-px bg-ink opacity-20"></div>
      </div>

      <Section 
        number="8" 
        title="Rotary Positional Embeddings (RoPE)"
        marginNote="Instead of adding numbers we rotate the vector. Meaning and magnitude are preserved. Position is encoded in the rotation."
      >
        <p>
          We need a way to encode position into embeddings that allows the model to learn transferable relationships without destroying the semantic purity of the original vectors. 
        </p> <br></br>
        <p>
          Enter <strong>RoPE</strong>. 
        </p><br></br>
        <p>
          Think again of our embeddings as arrows in high-dimension space. With RoPE, we encode positional information by rotating these arrows. The amount we rotate (<MathSpan>θ</MathSpan> "theta") depends entirely on the position in the sentence.
          So, instead of adding in positional information, we rotate embeddings in a consistent formulaic way depending on their position in the input sequence.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4 mb-8 marker:text-forest">
            <li><strong>Position 0:</strong> Rotate by <MathSpan>0</MathSpan> degrees.</li>
            <li><strong>Position 1:</strong> Rotate by <MathSpan>θ</MathSpan> degrees.</li>
            <li><strong>Position 2:</strong> Rotate by <MathSpan>2θ</MathSpan> degrees.</li>
            <li><strong>Position 3:</strong> Rotate by <MathSpan>3θ</MathSpan> degrees.</li>
            <li><strong>Position m:</strong> Rotate by <MathSpan>mθ</MathSpan> degrees.</li>
            
        </ul>
        
        <RopeIntroDemo />

        <h3 className="font-bold text-xl mt-8 mb-4">Why Rotation Wins</h3>
        <p>
           <strong>1. Length Preservation:</strong> When you rotate an object, it doesn't get bigger or smaller. Magnitude stays the same. 
           This means the "strength" of the semantic information (the length of the arrow) is never distorted by position, unlike the additive method.
        </p><br></br>
        <p>
           <strong>2. Relative Positions:</strong> Remember that the dot product (our similarity score) depends on the angle between two vectors and their magnitudes.
           If I rotate "Token A" by 10° and "Token B" by 20°, the angle <em>between</em> them is 10°. 
           If I move them both further down the sentence to positions 100 and 101, "Token A" rotates 1000° and "Token B" rotates 1010°. 
           The absolute angles are huge, but the angle <em>between</em> them is still exactly 10°. With magnitude held constant and the angles between two vectors dependent on position,
           the model can now effortlessly recognize "neighboring words" regardless of where they appear in the text.
        </p>
      </Section>

      <Section 
        number="9" 
        title="What Do We Rotate?"
        marginNote="By slicing high-dimensional vectors into 2D pairs, we can apply rotations to spaces we can actually visualize."
      >
        <p>
          With a light grasp of the benefits of rotary positional embeddings, we now need to clarify a few things. <br></br><br></br>
          First, while absolute embeddings added positional information before the self-attention layer, RoPE works within each attention head. Specifically, instead of Q, K, and V being calculated from embeddings with added positional info, RoPE allows attention heads to calculate their Q, K, and V vectors from the raw embeddings. So what does RoPE adjust to encode position? The Queries and Keys. Why? Because positional information matters the most during the attention score calculation and doing so at this stage allows for some beautiful mathematical properties that we will explore later. <br></br><br></br>
          
          Second, the previous visualization showed the rotation of a 2D vector for simplicity. We now know that RoPE encodes positional info into our high-dimension Query and Key vectors. But how? What does a rotation in 8 dimensions (and in real LLMs, hundred or thousands of dimensions) look like? Luckily for us, we don't need to know. With RoPE, we <strong>chunk</strong> the high-dimensional vector into pairs. An 8-dimensional vector is treated as 
          four separate 2-dimensional vectors. This allows us to work with simple 2D rotations where each pair is rotated independently.
        </p>
        
        <RopeSlicingDemo />

        <p>
           By visualizing these sliced pairs as geometric objects, we can see exactly what the model is working with. 
           Instead of one giant arrow, we have a collection of smaller arrows, each in its own 2D plane.
        </p>

        <VectorArrowVis />

        <p>
          This decomposition doesn't just make rotation easy to calculate, understand, and visualize. It allows us to rotate different parts of the vectors by different amounts for each increase in position. For instance, we could rotate the first pairs quickly with large rotation steps per increase in position (capturing fine-grained detail like immediate neighbors), while the last pairs could rotate
         slowly (providing the stability needed to capture long-range relationships across large input sequences).
        </p>
      </Section>

      <Section
        number="10"
        title="Frequencies"
        marginNote="The Base value dictates the 'span of attention'. A higher base allows for longer context context windows because the frequencies decay more slowly."
      >
        <p>
          Now that we have discussed adding positional information into Queries and Keys via rotation and seen how we split these vectors into 2D pairs, 
          how do we determine how much to rotate each pair?
        </p><br></br>
        <p>
          The rotation is based on two things: the pair's index in its vector (is it the first pair or the last pair?) and the token's position in the sequence.
          The first step is to calculate the <strong>Frequency</strong> (<MathSpan>θ</MathSpan>) for each pair. Think of this as the amount to rotate for each position step.
          Crucially, this frequency is <strong>consistent across all tokens</strong> (Pair 2 in all Queries and Keys will rotate at the same frequency, regardless of token position in the sequence).
          For any pair with index i, its frequency is calculated using the following formula:
          <MathSpan>{"\θ_i = Base^{-2i/d}"}</MathSpan>.
          This causes the first few pairs (low index) to have a high frequency (they rotate a lot with every step, 
          perfect for capturing information about immediate neighbors). The later dimensions (high index) have a tiny frequency (they barely move, 
          allowing them to track relationships across thousands of tokens). Choosing the base value in our frequency calculation is highly dependent on the particular use case of the model. A smaller base allows for more precise positional info (great for small sequences). A larger base sacrifices this precision in favor of understanding larger inputs.
        </p>
        
        <FrequencyDemo base={baseFrequency} onBaseChange={setBaseFrequency} />
        <p>
          We now have all the components needed to fully implement Rotary Positional Embeddings. 
          We have split our vectors into pairs, and have calculated a unique rotation speed (frequency) for each pair.
        </p><br></br>
        <p>
          To encode the position of a vector at position <MathSpan>m</MathSpan>, we simply rotate every pair in that vector by <MathSpan>m × θ_i</MathSpan>.
           In the visualization below, observe what happens as we move deeper into the sequence (increasing <MathSpan>m</MathSpan>). 
           Notice how the first pair (Pair 0) rotates rapidly, while the final pair (Pair 3) barely moves.
           For clarity, we visualize a standard "East-facing" vector (<MathSpan>[1, 0]</MathSpan>) for all pairs to isolate the rotational effect.
        </p>

        <RopeRotationDemo baseFrequency={baseFrequency} />

      </Section>

      <Section
        number="11"
        title="Applying RoPE to Our Input Sequence"
        marginNote="Finally, we see the transformation in context. Identical words ('Twinkle') now have rotated, distinct geometric representations."
      >
        <p>
          Let's bring it all back to our original input. We started with two identical "Twinkle" embeddings that the model couldn't distinguish. 
          We now apply the RoPE to every token in the sequence.
        </p><br></br>
        <p>
          In the interactive diagram below, you can manually trigger the rotation for each token.
          Notice that for <strong>Position 0</strong>, nothing happens (since we multiply by zero, we have no rotation).
          For <strong>Position 1</strong>, we apply a single rotation step.
          For <strong>Position 2</strong>, we apply a rotation of 2 steps (once for each position index step).
        </p>
        
        <RopeApplicationDemo baseFrequency={baseFrequency} />

         <p>
           After applying the rotation, "Twinkle" at position 0 and "Twinkle" at position 1 are now numerically distinct.  
            Because every number in the vector has been rotated by a specific angle based on its position, 
            the values are now fundamentally different.
          Their dot product with other words will now yield different results, allowing the attention head to "see" order.
         </p>
         <RopeOutcomeDemo />
      </Section>

      {/* PART 3 DIVIDER */}
      <div className="py-24 flex items-center justify-center">
        <div className="w-full h-px bg-ink opacity-20"></div>
        <h2 className="shrink-0 px-8 text-3xl font-serif text-ink italic">Part III: The Math</h2>
        <div className="w-full h-px bg-ink opacity-20"></div>
      </div>

      <MathIntroSection />
      <br></br><br></br><br></br>
      <Section
        number="12"
        title="Rotation As a Formula"
        marginNote="If we know where the stage (basis) moves, we know where the actors (coordinates) end up."
      >
        <p>
            To formalize the rotation of our 2D vectors, we need to look at what happens to our <strong>Basis Vectors</strong>: 
            <span className="font-mono text-rust mx-1">i (East)</span> and 
            <span className="font-mono text-forest mx-1">j (North)</span>.
        </p><br></br>
        <p>
            A vector <span className="font-mono bg-highlight px-1">v = [x, y]</span> can be rewritten as a linear combination <span className="font-mono">x·i + y·j</span>. 
            When we rotate the entire space by <span className="font-mono">θ</span>, we are effectively rotating <span className="font-mono text-rust">i</span> to a new position <span className="font-mono text-rust">i'</span>, 
            and <span className="font-mono text-forest">j</span> to a new position <span className="font-mono text-forest">j'</span>.
            The coordinates of our new rotated vector are simply the sum of these scaled, rotated basis vectors: 
            <span className="font-mono font-bold block mt-2 text-center">v' = x·i' + y·j'</span><br></br>
        </p>
        <p>
            We can derive the exact coordinates of <span className="font-mono text-rust">i'</span> and <span className="font-mono text-forest">j'</span> using the sine and cosine rules from the previous section. 
            Notice below how the vertical basis vector <span className="font-mono text-forest">j'</span> is simply the horizontal vector rotated by an additional 90 degrees.
        </p><br></br>

        <RotationDerivationDemo />
        
        <p>
            This derivation shows us how to mathematically rotate a 2D vector by an angle <MathSpan>θ</MathSpan>. We represent the rotation with a <strong>Rotation Matrix</strong>. When multiplied by a vector, the rotation matrix produces the rotated vector.
            As we saw in Part II, our Query and Key vectors are composed of multiple 2D pairs, and each pair rotates at a different frequency.
            This means the rotation for the entire vector is not a single 2x2 matrix, but a collection of them arranged along the diagonal of a larger matrix.
            This is known as a <strong>Block Diagonal Matrix</strong>.
        </p><br></br>
        <p>
            Let's see what the rotation of our 8D vectors looks like mathematically. To do so, let's pick the Query for <strong>"Little"</strong>. 
            Because it is in position <MathSpan>m=2</MathSpan>, every single frequency <MathSpan>θ<sub>i</sub></MathSpan> is multiplied by 2.
            The rotation applied to the first pair is <MathSpan>2·θ<sub>0</sub></MathSpan>. The rotation for the second pair is <MathSpan>2·θ<sub>1</sub></MathSpan>, and so on.
        </p>

        <RopeMatrixStructureDemo />
      </Section>

      <Section 
        number="13"
        title="How RoPE Simplifies During Attention"
        marginNote="Before we derive the final score, we must prepare our vectors. Note that standard matrix multiplication requires us to flip (transpose) the Query vector."
      >
        <p>
            We have now seen exactly how RoPE works geometrically and mathematically. We will now explore the simplification that makes it the modern standard for LLMs.
        </p><br></br>
        <p>
            When we calculate the dot product between a rotated Query and a Key, something remarkable happens. The complex rotation terms simplify, and the final score depends only on the original Q value, the original K value, and the relative distance between them.
            Let's walk through this interaction. We will continue with the <strong>Query vector of "Little"</strong> (at Position 2) and the <strong>Key vector of "Twinkle"</strong> (at Position 0). Below are the algebraic forms of our two vectors post-rotation. Notice that for "Little", the rotation term is <MathSpan>2·θ</MathSpan>, while for "Twinkle", it is <MathSpan>0·θ</MathSpan>.
        </p>
        
        <RopeDotProductIntro />

        <p>
            We have just looked at the rotated vectors <span className="font-bold text-rust">q'</span> and <span className="font-bold text-forest">k'</span>. As we previously saw, these are the original vectors multiplied by their respective rotation matrices.
            Therefore, we can represent our current formula: <MathSpan> Score = (q')^T · (k')</MathSpan>  as:
        </p>
        <p className="text-center my-4 font-mono font-bold text-lg">
            Score = (R<sub>2</sub> × q)<sup>T</sup> · (R<sub>0</sub> × k)
        </p>
        
        <RopeEquationDerivation />

        <p>
            Now we run into a bit of a wall. We have a transpose operation <MathSpan>T</MathSpan> wrapped around our first term. 
            There is a very specific rule for how to distribute a transpose across a multiplication: <strong>You must reverse the order.</strong>
        </p><br></br>
        <p>
            If you have two matrices <MathSpan>A</MathSpan> and <MathSpan>B</MathSpan>, then <MathSpan>(A · B)<sup>T</sup></MathSpan> is not <MathSpan>A^T · B^T</MathSpan>. 
            It is actually <MathSpan>B^T · A^T</MathSpan>.
        </p>

        <TransposePropertyDemo />
        
        <p>
            By applying this rule to our equation, we can "unwrap" the first term. 
            <MathSpan>(R_2 · q)^T</MathSpan> becomes <MathSpan>q^T · R_2^T</MathSpan>.
        </p>
        <p>
            This allows us to write the full equation as:
            <br/><br/>
            <span className="block text-center font-mono text-lg font-bold">
                 Score = (q<sup>T</sup> · R<sub>2</sub><sup>T</sup>) · (R<sub>0</sub> · k)
            </span><br></br>
        </p>
        <p>
            We have now transformed our equation into a chain of four matrices.
            Because the inner dimensions of these matrices align perfectly (8 matches 8), we have a valid chain of multiplication.
            Since matrix multiplication is <strong>Associative</strong>, we can group our terms however we like without changing the result.
            Instead of calculating the rotated vectors first, let's group the two rotation matrices together in the middle.
        </p>
        
        <AssociativityDemo />

        <p className="mt-8">
            This regrouping allows us to see the equation in a new light:
            <br/><br/>
            <span className="block text-center font-mono text-lg font-bold">
                 Score = q<sup>T</sup> · (R<sub>2</sub><sup>T</sup> · R<sub>0</sub>) · k
            </span><br></br>
        </p>
        <p>
            For a moment, let's forget about the vectors <span className="font-bold text-rust">q</span> and <span className="font-bold text-forest">k</span> since they are now static inputs. We are left with the <strong>Transpose</strong> of the rotation matrix at position <MathSpan>2</MathSpan> multiplied by the rotation matrix at position <MathSpan>0</MathSpan>.
            If we can calculate <MathSpan>R_2^T · R_0</MathSpan>, we can understand exactly how relative position is computed.
        </p>
        
        <RopeMultiplicationDemo />
        
        <p className="mt-12">
            The result of this multiplication is a rotation matrix filled with complex compound terms.
            Every cell contains a mix of sines and cosines of both <MathSpan>mθ</MathSpan> and <MathSpan>nθ</MathSpan>. This looks intimidating, but it is actually a disguised form of a very simple geometric truth. We just need to apply two standard <strong>Trigonometric Identities</strong> to collapse the mess.
        </p>
        
        <TrigIdentityVisualizer />

        <p>
             By substituting these identities back into our Product Matrix, the chaos evaporates. 
             Every complicated sum collapses into a single sine or cosine term dependent <strong>only</strong> on the relative distance <MathSpan>(m - n)</MathSpan>.
        </p>

        <RopeMatrixSimplificationDemo />
         <p>
            Let's bring our <span className="font-bold text-rust">q</span> and <span className="font-bold text-forest">k</span> vectors back to see what we are left with.
        </p>
        <div className="mt-12 p-8 bg-paper-dark border-2 border-ink relative">
          <p className="font-serif text-lg text-center mb-8 text-ink-light italic">
            By collapsing the middle terms, we are left with:
          </p>

          <div className="flex flex-col items-center gap-6">
             <div className="text-2xl md:text-4xl font-mono font-bold text-ink text-center leading-relaxed">
                Score = <span className="text-rust">q<sup>T</sup></span> · <span className="bg-highlight px-2 border border-ink/20 rounded">R<sub>(m-n)</sub></span> · <span className="text-forest">k</span>
             </div>

             <div className="w-full h-px bg-ink/10 my-2"></div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full">
                <div className="flex flex-col items-center">
                   <span className="font-mono text-rust font-bold mb-2">q</span>
                   <p className="text-sm font-serif">The original query</p>
                </div>
                <div className="flex flex-col items-center">
                   <span className="font-mono text-ink font-bold mb-2">R<sub>(m-n)</sub></span>
                   <p className="text-sm font-serif">The rotation defined <strong>only</strong> by relative distance</p>
                </div>
                <div className="flex flex-col items-center">
                   <span className="font-mono text-forest font-bold mb-2">k</span>
                   <p className="text-sm font-serif">The original key</p>
                </div>
             </div>
          </div>
        </div>

        <p><br></br>
           We started with two rotations based on positions<MathSpan>m</MathSpan> and <MathSpan>n</MathSpan> and ended with one rotation based on the distance between them.
        </p><br></br>
        <p>
          Therefore, it doesn't matter if "Twinkle" and "Little" are in positions 0 and 2, 100 and 102, or 250 and 252. Because of how RoPE simplifies, their similarity scores become a function of the original query, the original key and the distance between them. As long as they remain 2 positions apart, their scores will be the exact same. 
        </p>

      </Section>

      <Section
        number="14"
        title="Conclusion"
      >
        <p>
         RoPE is computationally inexpensive, easy to implement, mathematically elegant, and offers far more than its predecessors. When I first learned of it, I was incredibly confused by how and why it works. It wasn't until I spent a night doing calculations by hand that the intuition clicked. I made this with the hopes that you'll be able to understand this technique in far less time. Whether it be in the form of an in depth polishing of the finer points of LLM architecture or as a surface level introduction into what goes on under the hood of AI, I hope you found some value in this exploration. Either way, I encourage you to continue to learn and harness the power of these systems. If you enjoyed learning about RoPE, I'd encourage you to checkout multi-head latent attention and the modified version of RoPE it uses.   
        </p>
      </Section>

    </Layout>
  );
};

export default App;