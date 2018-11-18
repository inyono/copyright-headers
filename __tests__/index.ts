import {
  CopyrightHeaderOptions,
  CopyrightHeaderStatus,
  getUpdatedCopyrightHeader,
  php,
  phtml
} from '../src'

describe('php', () => {
  const options: CopyrightHeaderOptions = {
    lines: [
      'This file is part of @splish-me/copyright-headers',
      '',
      'Copyright (c) 2018 Splish UG (haftungsbeschränkt)'
    ]
  }

  test('does not start with <?php', () => {
    const input = ``
    const [status, output] = getUpdatedCopyrightHeader(input, php, options)

    expect(status).toEqual(CopyrightHeaderStatus.Added)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
`)
  })

  test('does start with <?php', () => {
    const input = `<?php
echo "foo bar";
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, options)

    expect(status).toEqual(CopyrightHeaderStatus.Added)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
echo "foo bar";
`)
  })

  test('does start with <?php (w/ unnecessary whitespace after opening tag)', () => {
    const input = `<?php


echo "foo bar";
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, options)

    expect(status).toEqual(CopyrightHeaderStatus.Added)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */


echo "foo bar";
`)
  })

  test('existing copyright header', () => {
    const input = `<?php
/**
 * Copyright (c) 2016 Splish UG (haftungsbeschränkt)
 */
echo "foo bar";
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, {
      ...options,
      shouldUpdate: () => true
    })

    expect(status).toEqual(CopyrightHeaderStatus.Changed)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
echo "foo bar";
`)
  })

  test('existing external copyright header', () => {
    const input = `<?php
/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, {
      ...options,
      shouldUpdate: () => false
    })

    expect(status).toEqual(CopyrightHeaderStatus.External)
    expect(output).toEqual(input)
  })

  test('multiple copyright headers', () => {
    const input = `<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2016 Splish UG (haftungsbeschränkt)
 */

/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, {
      ...options,
      shouldUpdate: () => true
    })

    expect(status).toEqual(CopyrightHeaderStatus.Changed)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */

/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
`)
  })

  test('multiple copyright headers (w/o newlines in between)', () => {
    const input = `<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2016 Splish UG (haftungsbeschränkt)
 */
/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, {
      ...options,
      shouldUpdate: () => true
    })

    expect(status).toEqual(CopyrightHeaderStatus.Changed)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
`)
  })
})

describe('phtml', () => {
  const options: CopyrightHeaderOptions = {
    lines: [
      'This file is part of @splish-me/copyright-headers',
      '',
      'Copyright (c) 2018 Splish UG (haftungsbeschränkt)'
    ]
  }

  test('does not start with <?php', () => {
    const input = ``
    const [status, output] = getUpdatedCopyrightHeader(input, phtml, options)

    expect(status).toEqual(CopyrightHeaderStatus.Added)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
?>
`)
  })

  test('does start with <?php', () => {
    const input = `<?php
echo "foo bar";
?>
`
    const [status, output] = getUpdatedCopyrightHeader(input, phtml, options)

    expect(status).toEqual(CopyrightHeaderStatus.Added)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
echo "foo bar";
?>
`)
  })

  test('existing copyright header', () => {
    const input = `<?php
/**
 * Copyright (c) 2016 Splish UG (haftungsbeschränkt)
 */
echo "foo bar";
?>
`
    const [status, output] = getUpdatedCopyrightHeader(input, phtml, {
      ...options,
      shouldUpdate: () => true
    })

    expect(status).toEqual(CopyrightHeaderStatus.Changed)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
echo "foo bar";
?>
`)
  })

  test('existing external copyright header', () => {
    const input = `<?php
/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
?>
`
    const [status, output] = getUpdatedCopyrightHeader(input, phtml, {
      ...options,
      shouldUpdate: () => false
    })

    expect(status).toEqual(CopyrightHeaderStatus.External)
    expect(output).toEqual(input)
  })

  test('multiple copyright headers', () => {
    const input = `<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2016 Splish UG (haftungsbeschränkt)
 */

/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
?>
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, {
      ...options,
      shouldUpdate: () => true
    })

    expect(status).toEqual(CopyrightHeaderStatus.Changed)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */

/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
?>
`)
  })

  test('multiple copyright headers (w/o newlines in between)', () => {
    const input = `<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2016 Splish UG (haftungsbeschränkt)
 */
/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
?>
`
    const [status, output] = getUpdatedCopyrightHeader(input, php, {
      ...options,
      shouldUpdate: () => true
    })

    expect(status).toEqual(CopyrightHeaderStatus.Changed)
    expect(output).toEqual(`<?php
/**
 * This file is part of @splish-me/copyright-headers
 *
 * Copyright (c) 2018 Splish UG (haftungsbeschränkt)
 */
/**
 * Copyright (c) 2016 Max Mustermann Corporation
 */
echo "foo bar";
?>
`)
  })
})
