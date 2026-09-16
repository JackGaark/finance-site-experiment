<script>
  import M from './lib/Math.svelte';
  import Figure from './lib/Figure.svelte';
  import TermStructure from './lib/charts/TermStructure.svelte';
  import TimeChart from './lib/charts/TimeChart.svelte';
  import YieldSolver from './lib/charts/YieldSolver.svelte';
  import ForwardRates from './lib/charts/ForwardRates.svelte';
  import BondPriceCurve from './lib/charts/BondPriceCurve.svelte';
  import Evidence from './lib/charts/Evidence.svelte';
</script>

<main class="page">
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="/">home</a><span class="sep">/</span><a href="/">notes</a><span class="sep">/</span>term structure
  </nav>

  <h1>The term structure of interest rates</h1>
  <p class="meta">
    2026 9 16<span class="amp">&amp;&amp;</span>14 min read<span class="amp">&amp;&amp;</span><span class="tag">guide</span>
  </p>

  <p class="lede">
    A bond chapter usually pretends there is one interest rate. There isn't. Lending for one year and lending for two are
    different deals, and the market prices them differently. This note works through the appendix that follows
    the bond chapter in Ross, Westerfield and Jaffe: what a spot rate is, why a coupon bond's yield is a blurred
    average of spot rates, how a forward rate falls out of two spot rates, and what the shape of the curve is
    supposed to tell you.
  </p>

  <!-- ---------------------------------------------------------------- -->
  <h2>Two bonds, two rates</h2>

  <p>
    Take two zero coupon bonds. Bond A pays $1,000 in one year. Bond B pays $1,000 in two years. The one-year rate
    <M tex={String.raw`r_1`} /> is 8 percent and the two-year rate <M tex={String.raw`r_2`} /> is 10 percent. These are <em>spot rates</em>:
    the rate you get by lending today, for a stated number of years, with nothing paid in between. Perhaps the gap
    exists because inflation is expected to be higher in the second year than in the first. Whatever the reason, the
    prices follow directly.
  </p>

  <M display number="A.0" tex={String.raw`\begin{aligned} PV_A &= \frac{\$1{,}000}{1.08} = \$925.93 \\[6pt] PV_B &= \frac{\$1{,}000}{(1.10)^2} = \$826.45 \end{aligned}`} />

  <p>
    The relationship runs both ways. If you could see the prices but not the rates, you would recover the spot rates
    from the same formula: $925.93 for a one-year dollar means <M tex={String.raw`r_1 = 8\%`} />, and $826.45 for a two-year
    dollar means <M tex={String.raw`r_2 = 10\%`} />. In a market with enough zero coupon government bonds, that is exactly how
    spot rates are read off.
  </p>

  <!-- ---------------------------------------------------------------- -->
  <h2>Pricing a coupon bond, and the yield that summarises it</h2>

  <p>
    Now a harder bond. With the same spot rates, what should a two-year bond with a 5 percent coupon cost? It pays
    $50 at date 1 and $1,050 at date 2. The trick is to see it as a portfolio of two zero coupon bonds and discount
    each payment at the spot rate for its own date.
  </p>

  <M display number="A.1" tex={String.raw`PV = \frac{\$50}{1.08} + \frac{\$1{,}050}{(1.10)^2} = \$914.06`} />

  <p>
    That is the price. The textbook then asks for a single rate that describes the bond. Solve for the
    <M tex={String.raw`y`} /> that discounts both payments back to the price you just found.
  </p>

  <M display number="A.2" tex={String.raw`\$914.06 = \frac{\$50}{1+y} + \frac{\$1{,}050}{(1+y)^2}`} />

  <p>
    Here <M tex={String.raw`y = 9.95\%`} />. This is the <em>yield to maturity</em>. Notice the asymmetry between the two
    equations. A.1 uses two marketwide spot rates to get the price. A.2 takes that price and finds one rate that
    reproduces it. So the yield is a kind of average of the spot rates, weighted toward whichever dates carry the
    most cash.<sup>1</sup> For a bond with more than four payments there is no closed form, and you find
    <M tex={String.raw`y`} /> by trial and error, which is what the chart below does for you.
  </p>

  <Figure
    wide
    label="Yield to maturity as a root."
    caption="The curve is the present value of the bond's two payments at a single rate y. Where it meets the price fixed by the spot rates, that y is the yield to maturity. Change the coupon and watch the yield drift between r₁ and r₂."
  >
    <YieldSolver />
  </Figure>

  <p>
    Try a 12 percent coupon. The price rises to $1,036.73 and the yield falls to 9.89 percent, because more of the
    money now arrives at date 1, where the spot rate is lower. Two bonds with the same maturity but different coupons
    will usually have different yields. This is why comparing bonds by yield alone is a rough habit: the yield
    depends on the coupon, the spot rates do not.
  </p>

  <!-- ---------------------------------------------------------------- -->
  <h2>Graphing the term structure</h2>

  <p>
    The <em>term structure</em> is just the set of spot rates laid out by maturity. The textbook draws it as
    Figure 5A.1, where the rates rise with maturity, <M tex={String.raw`r_3 > r_2 > r_1`} />. A term structure exists only for a
    moment. The one at 10:00 a.m. on 30 July 2006 is gone by 10:01, replaced by a similar but different one.
  </p>

  <Figure
    label="Figure 5A.1 from the appendix."
    caption="The original plate: spot rates for one, two and three years, at one moment in time."
  >
    <img class="plate" src="/figures/fig-5a1.png" alt="Textbook chart of spot interest rates in percent against time in years, with three points labelled r1 at about 4 percent, r2 at about 5.2 percent and r3 at about 6.2 percent." width="475" height="380" />
  </Figure>

  <p>
    A live version is more useful. Drag any spot rate up or down. The dashed line shows the one-year forward
    rate that the spot rates imply for each year, which is the subject of the next section, and it is worth
    noticing already how much more it moves than the spot rates themselves.
  </p>

  <Figure
    wide
    label="The term structure, with the forward rates it implies."
    caption="Each solid point is a spot rate you can drag. Each hollow point is the forward rate over that year that the two neighbouring spot rates force. Arrow keys work too when a point has focus."
  >
    <TermStructure />
  </Figure>

  <Figure
    label="Three shapes."
    caption="A rising curve is the common case. A flat one means maturity does not matter. An inverted one, with short rates above long rates, has preceded most recessions in the postwar record."
  >
    <img src="/figures/curve-shapes.svg" alt="Three small charts of spot rate against maturity: a rising curve, a flat line, and a falling, inverted curve." width="720" height="230" />
  </Figure>

  <!-- ---------------------------------------------------------------- -->
  <h2>The forward rate</h2>

  <p>
    Stay with <M tex={String.raw`r_1 = 8\%`} /> and <M tex={String.raw`r_2 = 10\%`} />. Someone who puts $1 in the two-year bond has
    <M tex={String.raw`\$1 \times (1.10)^2 = \$1.21`} /> after two years. It is worth rewriting that number.
  </p>

  <M display number="A.3" tex={String.raw`\$1 \times (1.10)^2 = \$1 \times 1.08 \times 1.1204`} />

  <p>
    Equation A.3 says the two-year investor ends up exactly where they would if they had earned 8 percent in the
    first year and 12.04 percent in the second. That hypothetical second-year rate is the <em>forward rate</em>. The
    two-year bond can be read as taking the one-year spot rate and locking in 12.04 percent for year two. Both spot
    rates are known at date 0, so the forward rate is known at date 0 as well. Nothing about it is a forecast.
  </p>

  <Figure
    wide
    label="Breaking a two-year spot rate into a spot rate and a forward rate."
    caption="The top row is the two-year bond held to maturity. The bottom row is the same dollar earning r₁ for a year, then the forward rate f₂ for a year. The two rows must end in the same place, and that fixes f₂."
  >
    <TimeChart />
  </Figure>

  <p>In general, given <M tex={String.raw`r_1`} /> and <M tex={String.raw`r_2`} />, the forward rate <M tex={String.raw`f_2`} /> is whatever makes the two routes agree:</p>

  <M display number="A.4" tex={String.raw`(1+r_2)^2 = (1+r_1)\times(1+f_2)`} />
  <M display number="A.5" tex={String.raw`f_2 = \frac{(1+r_2)^2}{1+r_1} - 1`} />

  <p>
    Check it with different numbers. If the one-year spot rate is 7 percent and the two-year is 12 percent,
    <M tex={String.raw`f_2 = (1.12)^2 / 1.07 - 1 = 17.23\%`} />. A two-year investor is treated as though they receive 7 percent
    and simultaneously lock in 17.23 percent for the second year. The steeper the curve, the further the forward
    rate sits above the long rate, which is the lever the interactive figure above lets you feel.
  </p>

  <p>The same idea extends to any year. The forward rate over year <M tex={String.raw`n`} /> is</p>

  <M display number="A.6" tex={String.raw`f_n = \frac{(1+r_n)^n}{(1+r_{n-1})^{\,n-1}} - 1`} />

  <p>
    where <M tex={String.raw`r_n`} /> is the <M tex={String.raw`n`} />-year spot rate and <M tex={String.raw`r_{n-1}`} /> the spot rate for one year
    less. The forward rate over the first year is the one-year spot rate by definition, so nobody bothers to name
    it. The textbook's worked set of rates is 5, 6, 7 and 6 percent for years one to four:
  </p>

  <M display tex={String.raw`\begin{aligned} f_2 &= \frac{(1.06)^2}{1.05} - 1 = 7.01\% \\[6pt] f_3 &= \frac{(1.07)^3}{(1.06)^2} - 1 = 9.03\% \\[6pt] f_4 &= \frac{(1.06)^4}{(1.07)^3} - 1 = 3.06\% \end{aligned}`} />

  <Figure
    wide
    label="Spot rates in, forward rates out."
    caption="Type any four spot rates. The forward rate over a year is the marginal rate that year contributes, so a curve that turns down in year four produces a forward rate far below any spot rate."
  >
    <ForwardRates />
  </Figure>

  <div class="aside">
    <p>
      What a first-time reader should be able to do at this point: given equations A.5 and A.6, turn a list of spot
      rates into a list of forward rates. That part is mechanical. The intuition to hold onto is the time chart: a
      long bond is a short bond plus a rate locked in for the later years.
    </p>
  </div>

  <!-- ---------------------------------------------------------------- -->
  <h2>What a bond will be worth next year</h2>

  <p>
    Now change the example so that each bond sells at par, $1,000, and pays more than that at maturity. With the
    spot rates still 8 and 10 percent, bond A pays $1,080 at date 1 and bond B pays $1,210 at date 2.
  </p>

  <Figure
    label="The par-bond setup, from the appendix."
    caption="Both bonds cost $1,000 today. The one-year spot rate that will apply from date 1 to date 2 is unknown at date 0."
  >
    <img class="plate" src="/figures/par-bonds.png" alt="Textbook time chart. Bond A: $1,000 initial purchase price, 8 percent, $1,080 payment at maturity at date 1. Bond B: $1,000, 10 percent, $1,210 at date 2. A note says the one-year spot rate from date 1 to date 2 is unknown as of date 0." width="655" height="300" />
  </Figure>

  <p>
    The price of bond A at date 1 is easy. It pays $1,080 then, so it is worth $1,080. Bond B is the hard one. At
    date 1 it has a year to run, and its price depends on the one-year spot rate that prevails <em>over year 2</em>,
    a rate nobody knows at date 0. If inflation rises during year 1, that rate will probably be high. If inflation
    falls, low.
  </p>

  <p>Suppose it turns out to be 6 percent. Then $1,000 invested at date 1 grows to $1,060, and bond B is worth</p>

  <M display number="A.7" tex={String.raw`\$1{,}141.51 = \frac{\$1{,}210}{1.06}`} />

  <p>If instead the rate is 7 percent, the price is lower:</p>

  <M display number="A.8" tex={String.raw`\$1{,}130.84 = \frac{\$1{,}210}{1.07}`} />

  <p>And at 14 percent, lower still, $1,061.40. The whole schedule is a single curve.</p>

  <Figure
    wide
    label="Table 5A.1 as a curve."
    caption="The price of bond B at date 1 for every possible one-year spot rate over year 2. The three marked points are the textbook's cases."
  >
    <BondPriceCurve />
  </Figure>

  <p>
    So although the forward rate is known at date 0, the price of bond B at date 1 is not. Before date 1 all anyone
    can talk about is the price the bond is <em>expected</em> to sell for:
  </p>

  <M display number="A.9" tex={String.raw`\text{Expected price of B at date 1} = \frac{\$1{,}210}{1 + \text{spot rate expected over year 2}}`} />

  <p>
    Two remarks. Everybody's expectation is different, so later the textbook speaks of a consensus across investors.
    And A.9 is a forecast made at date 0 of a price that will be set at date 1.<sup>2</sup>
  </p>

  <!-- ---------------------------------------------------------------- -->
  <h2>Forward rate versus expected spot rate</h2>

  <p>Someone who wants to invest for exactly one year has two ways to do it.</p>

  <Figure
    label="Two strategies for a one-year horizon."
    caption="Strategy 1 ends with a known amount. Strategy 2 ends wherever the market puts the price of a one-year bond next year."
  >
    <img src="/figures/two-strategies.svg" alt="Diagram of two strategies on a timeline from date 0 to date 2. Strategy 1: $1,000 in a one-year bond at 8 percent becomes a certain $1,080 at date 1. Strategy 2: $1,000 in a two-year bond sold at date 1 for $1,141.51 if the year-two rate is 6 percent, $1,130.84 if 7 percent, or $1,061.40 if 14 percent, unknown until date 1." width="720" height="300" />
  </Figure>

  <ol>
    <li>Buy a one-year bond. Proceeds at date 1 are certain: <M tex={String.raw`\$1{,}080 = \$1{,}000 \times 1.08`} />. <span style="color: var(--ink-3)">(A.10)</span></li>
    <li>Buy a two-year bond and sell it at date 1. Expected proceeds are the expected price of bond B. <span style="color: var(--ink-3)">(A.11)</span></li>
  </ol>

  <M display number="A.11" tex={String.raw`\frac{\$1{,}000 \times (1.10)^2}{1 + \text{spot rate expected over year 2}}`} />

  <p>Using the forward rate, A.11 can be rewritten, and this is the step that makes everything click:</p>

  <M display number="A.12" tex={String.raw`\frac{\$1{,}000 \times 1.08 \times 1.1204}{1 + \text{spot rate expected over year 2}}`} />

  <p>
    When does strategy 1 earn the same as strategy 2 is expected to earn? Set A.10 equal to A.12 and the $1,000 and
    the 1.08 cancel. What is left is the condition
  </p>

  <M display number="A.13" tex={String.raw`12.04\% = \text{spot rate expected over year 2}`} />

  <p>
    If the forward rate equals the expected spot rate, you expect the same return over the first year whether you
    hold a one-year bond or a two-year bond that you sell after a year.
  </p>

  <h3>The expectations hypothesis</h3>

  <p>
    It seems reasonable that investors would set rates this way. Imagine a market of people who do not care about
    risk. If <M tex={String.raw`f_2`} /> were below the expected spot rate over year 2, anyone investing for one year would
    prefer the one-year bond, because the two-year bond sold early would be expected to earn less. Demand would push
    the rates until the gap closed. Generalising A.13:
  </p>

  <M display number="A.14" tex={String.raw`f_2 = \text{spot rate expected over year 2}`} />

  <p>
    This is the <em>expectations hypothesis</em>. The forward rate over the second year is set to the one-year spot
    rate the market expects to prevail over the second year. Under it, a rising curve means the market expects short
    rates to rise, and nothing more.
  </p>

  <h3>The liquidity preference hypothesis</h3>

  <p>
    Many students conclude that A.14 must hold. But the argument assumed risk-neutral investors. Suppose instead they
    are averse to risk. For a one-year horizon, strategy 1 has no risk: the return will be <M tex={String.raw`r_1`} />. Strategy 2
    has plenty, because the final proceeds depend on where rates go. No risk-averse investor picks strategy 2 if
    both have the same expected return. They can only be indifferent when strategy 2 is expected to pay more, and
    since the two strategies match when <M tex={String.raw`f_2`} /> equals the expected spot rate, that means
  </p>

  <M display number="A.15" tex={String.raw`f_2 > \text{spot rate expected over year 2}`} />

  <p>
    To induce people to hold the riskier two-year bond, the market sets the forward rate above the spot rate it
    expects. This is the <em>liquidity preference hypothesis</em>. Under it, a rising curve carries a premium for
    bearing interest-rate risk on top of whatever the market expects short rates to do.
  </p>

  <p>
    The horizon matters. Consider someone investing for two years instead. They could buy a two-year zero, which is
    riskless for them, or buy a one-year bond and roll it into another, which is not, since the year-2 rate is
    unknown. For that investor the same logic runs the other way:
  </p>

  <M display number="A.16" tex={String.raw`f_2 < \text{spot rate expected over year 2}`} />

  <p>
    So risk aversion alone does not settle the sign. A.15 describes a market dominated by one-year horizons, A.16 a
    market of two-year horizons. Financial economists generally argue that the typical investor's horizon is much
    shorter than the maturity of the bonds on offer, and take A.15 as the better description of equilibrium.
  </p>

  <!-- ---------------------------------------------------------------- -->
  <h2>What the evidence says</h2>

  <p>
    Economists are never satisfied by inspecting a theory's assumptions. The question of risk-neutral or risk-averse
    investors is empirical. The appendix offers one result to give the flavour. Compare two strategies over the
    period January 1926 to December 1999: invest in a one-year bond, or buy a 20-year bond and sell it after one
    year, repeating both every year.
  </p>

  <table class="plain">
    <thead><tr><th>Strategy, repeated yearly 1926 to 1999</th><th class="num">Average yearly return</th></tr></thead>
    <tbody>
      <tr><td>Buy a one-year bond</td><td class="num">3.8%</td></tr>
      <tr><td>Buy a 20-year bond, sell after one year</td><td class="num">5.5%</td></tr>
    </tbody>
  </table>

  <p>
    The expectations hypothesis says the two should be identical. The liquidity preference hypothesis says the second
    should be higher. Nobody observes expected returns directly, but 74 years of actual returns are a fair proxy, and
    the gap is generally read as support for liquidity preference.<sup>3</sup>
  </p>

  <Figure
    wide
    label="What 1.7 points a year amounts to."
    caption="Growth of one dollar at each strategy's average return, compounded over the sample. This compounds the averages rather than the actual year-by-year returns, so it shows the size of the gap, not the path."
  >
    <Evidence />
  </Figure>

  <!-- ---------------------------------------------------------------- -->
  <h2>Problems</h2>

  <p>The appendix closes with six questions. The tools above answer all of them.</p>

  <ol>
    <li>
      <strong>Bond pricing.</strong> The one-year spot rate is 8 percent and the two-year spot rate is 10 percent.
      What is the price of a two-year bond paying a 6 percent annual coupon, and what is its yield to maturity?
    </li>
    <li>
      <strong>Bond pricing.</strong> The one-year spot rate is 11 percent and the two-year spot rate is 8 percent.
      What is the price of a two-year bond paying a 5 percent annual coupon?
    </li>
    <li>
      <strong>Forward rates.</strong> If the one-year spot rate is 7 percent and the two-year spot rate is 8.5
      percent, what is the one-year forward rate over the second year?
    </li>
    <li>
      <strong>Forward rates.</strong> Spot rates are 4, 5.5 and 6.5 percent for years one to three. Find the forward
      rate over the second year and over the third.
    </li>
    <li>
      <strong>Term structure.</strong> Forward rates are 4.5 percent over year one and 6.0 percent over year two.
      Compute the spot rates for years one and two.
    </li>
    <li>
      <strong>Term structure.</strong> Strategy 1 is to buy a two-year bond and sell it in year one. Strategy 2 is to
      buy a one-year bond. For what range of spot rates expected over year 2 is strategy 1 the better choice? Explain.
    </li>
  </ol>

  <hr />

  <div class="footnotes">
    <ol>
      <li>Yield to maturity is not a simple average of <M tex={String.raw`r_1`} /> and <M tex={String.raw`r_2`} />. Financial economists call it a time-weighted average of the two. For a two-year bond the quadratic formula solves for <M tex={String.raw`y`} />; beyond four payment dates there is no formula.</li>
      <li>Strictly, A.9 is an approximation because of Jensen's inequality: the expected value of <M tex={String.raw`1/(1+r)`} /> is not <M tex={String.raw`1/(1+\mathbb{E}[r])`} />. The appendix, and this note, ignore the difference.</li>
      <li>From <em>Stocks, Bonds, Bills and Inflation 2000 Yearbook</em>, Ibbotson Associates, updating work by Roger G. Ibbotson and Rex A. Sinquefield. Strategy 2 never holds a 20-year bond to maturity; it buys one and sells it a year later as a 19-year bond, 74 times in 74 years.</li>
    </ol>
    <p style="margin-top: 1.2rem">
      Source material: Appendix 5A, “The Term Structure of Interest Rates, Spot Rates, and Yield to Maturity,” from
      Ross, Westerfield and Jaffe, <em>Corporate Finance</em>, Chapter 5, as distributed at Penn. The figures marked
      as plates are reproduced from that appendix. Everything interactive was built for this page.
    </p>
  </div>
</main>
