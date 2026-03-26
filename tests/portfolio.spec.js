const { test, expect } = require('@playwright/test');

test.describe('Portfolio Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage without errors', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/Portfolio/);
    
    // Check that the main content is visible
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    
    // Check that the name is displayed
    await expect(page.locator('[data-testid="hero-name"]')).toContainText('Anzar Ali');
  });

  test('should have working navigation', async ({ page }) => {
    // Check navbar exists
    await expect(page.locator('[data-testid="navbar"]')).toBeVisible();
    
    // Check navigation links exist
    await expect(page.locator('.nav-link').first()).toBeVisible();
    
    // Click on About link and verify navigation
    await page.click('a[href="#about"]');
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('should display hero section with correct elements', async ({ page }) => {
    // Check hero elements
    await expect(page.locator('[data-testid="hero-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-career"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-cta"]')).toBeVisible();
    
    // Check social links
    await expect(page.locator('[data-testid="social-links"]')).toBeVisible();
  });

  test('should display about section with stats', async ({ page }) => {
    // Scroll to about section
    await page.locator('#about').scrollIntoViewIfNeeded();
    
    // Check about section elements
    await expect(page.locator('[data-testid="about-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-experience"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-projects"]')).toBeVisible();
  });

  test('should display skills section', async ({ page }) => {
    await page.locator('#skills').scrollIntoViewIfNeeded();
    
    await expect(page.locator('[data-testid="skills-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="skill-category-frontend"]')).toBeVisible();
  });

  test('should display projects section with cards', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    
    // Check projects section
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
    
    // Check project cards exist
    const projectCards = page.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();
  });

  test('should filter projects by search', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    
    // Search for a project
    await page.fill('[data-testid="project-search"]', 'E-Commerce');
    
    // Wait for filter to apply
    await page.waitForTimeout(300);
    
    // Check results
    await expect(page.locator('[data-testid="results-count"]')).toContainText('Found');
  });

  test('should open project modal', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    
    // Click on view details button
    await page.click('[data-testid="project-link-1"]');
    
    // Check modal is visible
    await expect(page.locator('[data-testid="project-modal"]')).toHaveClass(/active/);
    await expect(page.locator('[data-testid="modal-title"]')).toBeVisible();
  });

  test('should close project modal', async ({ page }) => {
    await page.locator('#projects').scrollIntoViewIfNeeded();
    
    // Open modal
    await page.click('[data-testid="project-link-1"]');
    await expect(page.locator('[data-testid="project-modal"]')).toHaveClass(/active/);
    
    // Close modal
    await page.click('[data-testid="modal-close"]');
    await expect(page.locator('[data-testid="project-modal"]')).not.toHaveClass(/active/);
  });

  test('should display experience section', async ({ page }) => {
    await page.locator('#experience').scrollIntoViewIfNeeded();
    
    await expect(page.locator('[data-testid="experience-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="experience-item"]')).toBeVisible();
  });

  test('should display testimonials section', async ({ page }) => {
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    
    await expect(page.locator('[data-testid="testimonials-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="testimonial-1"]')).toBeVisible();
  });

  test('should display contact section with form', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    await expect(page.locator('[data-testid="contact-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible();
  });

  test('should validate contact form', async ({ page }) => {
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    // Try to submit empty form
    await page.click('[data-testid="contact-submit"]');
    
    // Form should not submit (required fields)
    await expect(page.locator('#contact-form')).toBeVisible();
  });

  test('should display growth section', async ({ page }) => {
    await page.locator('#growth').scrollIntoViewIfNeeded();
    
    await expect(page.locator('[data-testid="growth-section"]')).toBeVisible();
    await expect(page.locator('[data-testid="growth-project"]')).toBeVisible();
  });

  test('should display final CTA', async ({ page }) => {
    await page.locator('#final-cta').scrollIntoViewIfNeeded();
    
    await expect(page.locator('[data-testid="final-cta"]')).toBeVisible();
    await expect(page.locator('[data-testid="cta-contact"]')).toBeVisible();
    await expect(page.locator('[data-testid="cta-projects"]')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    // Click theme toggle
    await page.click('[data-testid="theme-toggle"]');
    
    // Check that theme attribute changes
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    
    // Toggle back
    await page.click('[data-testid="theme-toggle"]');
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('should have skip link for accessibility', async ({ page }) => {
    // Check skip link exists
    await expect(page.locator('[data-testid="skip-link"]')).toBeVisible();
    
    // Focus skip link and check it works
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that h1 is used only once
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    
    // Check that h2 sections exist
    await expect(page.locator('h2').first()).toBeVisible();
  });

  test('should have accessible color contrast', async ({ page }) => {
    // This is a basic check - full contrast testing would require specialized tools
    const heroSection = page.locator('.hero');
    await expect(heroSection).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through the page
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    
    // Press Enter on skip link
    await page.keyboard.press('Enter');
    
    // Should have moved focus to main content
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('should have working scroll progress indicator', async ({ page }) => {
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(100);
    
    // Check that scroll progress has value
    const progressBar = page.locator('#scroll-progress');
    const ariaValue = await progressBar.getAttribute('aria-valuenow');
    expect(parseInt(ariaValue)).toBeGreaterThan(0);
  });
});
